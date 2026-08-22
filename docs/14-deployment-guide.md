# 14 — Deployment Guide

Target: **Ubuntu 24.04 LTS · Nginx · PHP 8.3-FPM · Node 20 · MySQL 8 · Redis 7 · Cloudflare**

Diagram: [`15-cloud-architecture.html`](./15-cloud-architecture.html)

---

## 1. Server provisioning

Minimum viable spec for the traffic profile in the brief: **4 vCPU / 8 GB RAM / 80 GB NVMe.**
Both applications on one box is a deliberate choice at this scale — the network hop
saved on SSR data fetching is worth more than the isolation, and the split is a
configuration change when traffic justifies it.

```bash
# ── base ────────────────────────────────────────────────────────────────────
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip software-properties-common ufw fail2ban

sudo timedatectl set-timezone Asia/Kolkata
sudo hostnamectl set-hostname nsk-prod-01

# ── firewall: only SSH (restricted) and HTTPS from Cloudflare ───────────────
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from <YOUR_ADMIN_IP> to any port 22 proto tcp

# 443 only from Cloudflare — the origin must never be reachable directly
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do sudo ufw allow from $ip to any port 443 proto tcp; done
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do sudo ufw allow from $ip to any port 443 proto tcp; done
sudo ufw enable

sudo systemctl enable --now fail2ban
```

```bash
# ── runtimes ────────────────────────────────────────────────────────────────
sudo add-apt-repository -y ppa:ondrej/php && sudo apt update
sudo apt install -y php8.3-{fpm,cli,mysql,redis,mbstring,xml,curl,zip,bcmath,gd,intl,opcache}

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

sudo apt install -y mysql-server redis-server nginx
curl -sS https://getcomposer.org/installer | php && sudo mv composer.phar /usr/local/bin/composer

sudo mysql_secure_installation
```

---

## 2. Database

```sql
CREATE DATABASE nsk_computer_zone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nsk_app'@'localhost' IDENTIFIED BY '<generated>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES, DROP
  ON nsk_computer_zone.* TO 'nsk_app'@'localhost';
FLUSH PRIVILEGES;
```

The application user is deliberately **not** granted `ALL` — no `GRANT`, no `FILE`,
no `SUPER`. Migrations need DDL; nothing needs superuser.

`/etc/mysql/mysql.conf.d/nsk.cnf`:
```ini
[mysqld]
innodb_buffer_pool_size = 3G      # ~40% of RAM
innodb_log_file_size    = 512M
innodb_flush_method     = O_DIRECT
max_connections         = 200
slow_query_log          = 1
long_query_time         = 1
character-set-server    = utf8mb4
collation-server        = utf8mb4_unicode_ci
log_bin                 = /var/log/mysql/mysql-bin.log   # PITR
binlog_expire_logs_seconds = 2592000                     # 30 days
```

---

## 3. Backend deploy

```bash
sudo mkdir -p /var/www/nskcomputerzone && sudo chown -R $USER:www-data /var/www/nskcomputerzone
cd /var/www/nskcomputerzone && git clone <repo> . && cd backend

composer install --no-dev --optimize-autoloader --no-interaction
cp .env.example .env && php artisan key:generate
# → edit .env: DB, Redis, mail, R2, ANTHROPIC_API_KEY, SANCTUM_STATEFUL_DOMAINS, ADMIN_PASSWORD

php artisan migrate --force
php artisan db:seed --force

# remove the bootstrap admin password once the account exists
sed -i '/^ADMIN_PASSWORD=/d' .env

php artisan config:cache route:cache view:cache event:cache
php artisan storage:link

sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

`/etc/php/8.3/fpm/conf.d/99-nsk.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0     ; production only — reload FPM to pick up code changes
realpath_cache_size=4096K
upload_max_filesize=12M
post_max_size=14M
expose_php=Off
```

---

## 4. Frontend deploy

```bash
cd /var/www/nskcomputerzone/frontend
npm ci
npm run images:fetch          # populates public/images/** and the metadata manifest
npm run build

pm2 start npm --name nsk-web -i max -- start
pm2 save && pm2 startup systemd
```

`npm ci` (not `install`) so the lockfile is authoritative. `pm2 -i max` runs one Node
process per core in cluster mode.

---

## 5. Queue workers & scheduler

`/etc/supervisor/conf.d/nsk-worker.conf`:
```ini
[program:nsk-worker]
command=php /var/www/nskcomputerzone/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600 --backoff=10
user=www-data
numprocs=2
autostart=true
autorestart=true
stopwaitsecs=3600
redirect_stderr=true
stdout_logfile=/var/log/supervisor/nsk-worker.log
```

```bash
sudo supervisorctl reread && sudo supervisorctl update && sudo supervisorctl start nsk-worker:*

# scheduler
(crontab -l 2>/dev/null; echo "* * * * * cd /var/www/nskcomputerzone/backend && php artisan schedule:run >> /dev/null 2>&1") | crontab -
```

`--max-time=3600` recycles workers hourly, which caps memory growth from long-lived
PHP processes.

---

## 6. Nginx

`/etc/nginx/sites-available/nskcomputerzone`:
```nginx
upstream sh_next { server 127.0.0.1:3000; keepalive 64; }

# Recover the real client IP from behind Cloudflare.
# Without this every request appears to come from a Cloudflare edge node and
# per-IP rate limiting becomes meaningless.
include /etc/nginx/cloudflare-ips.conf;
real_ip_header CF-Connecting-IP;

server {
    listen 80;
    server_name nskcomputerzone.in www.nskcomputerzone.in api.nskcomputerzone.in;
    return 301 https://$host$request_uri;
}

# ── API ────────────────────────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    server_name api.nskcomputerzone.in;
    root /var/www/nskcomputerzone/backend/public;
    index index.php;

    ssl_certificate     /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 12M;

    location / { try_files $uri $uri/ /index.php?$query_string; }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 60s;
    }

    location ~ /\.(?!well-known) { deny all; }
}

# ── Website ────────────────────────────────────────────────────────────────
server {
    listen 443 ssl http2;
    server_name nskcomputerzone.in www.nskcomputerzone.in;

    ssl_certificate     /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Immutable build output — served from disk, never proxied to Node.
    location /_next/static/ {
        alias /var/www/nskcomputerzone/frontend/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location /images/ {
        alias /var/www/nskcomputerzone/frontend/public/images/;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass http://sh_next;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nskcomputerzone /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 7. Cloudflare

| Setting | Value |
| --- | --- |
| DNS | `A` records for `@`, `www`, `api` — **proxied (orange cloud)** |
| SSL/TLS | **Full (strict)** with a Cloudflare Origin Certificate installed on the box |
| Edge Certificates | Always Use HTTPS · HSTS (max-age 2 years, includeSubDomains, preload) · TLS 1.3 · Min TLS 1.2 |
| Speed | Brotli on · Auto Minify off (Next.js already minifies; double-minifying breaks source maps) |
| Caching | Standard; **cache rule bypassing `/api/*`** |
| WAF | Managed ruleset on · OWASP Core on · Bot Fight Mode on |
| Rate limiting | 30 req/min per IP on `/api/v1/enquiries` and `/api/v1/build-requests` |
| Firewall | Block non-Indian traffic to `/admin` if the team is India-only |
| Network | HTTP/3 on · 0-RTT off (replay risk on mutating requests) |

---

## 8. Backups

`/usr/local/bin/nsk-backup.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F-%H%M)
DEST=/var/backups/nskcomputerzone
mkdir -p "$DEST"

mysqldump --single-transaction --routines --triggers --quick \
  -u nsk_app -p"$DB_PASSWORD" nsk_computer_zone | gzip > "$DEST/db-$STAMP.sql.gz"

tar -czf "$DEST/env-$STAMP.tar.gz" \
  /var/www/nskcomputerzone/backend/.env \
  /var/www/nskcomputerzone/frontend/.env.production

aws s3 sync "$DEST" "s3://nsk-backups/$(date +%Y/%m)/" --endpoint-url "$R2_ENDPOINT"
find "$DEST" -type f -mtime +7 -delete
```

```bash
sudo chmod 700 /usr/local/bin/nsk-backup.sh
(crontab -l; echo "30 2 * * * /usr/local/bin/nsk-backup.sh >> /var/log/nsk-backup.log 2>&1") | crontab -
```

**Test the restore quarterly.** A backup that has never been restored is a hypothesis,
not a backup.

---

## 9. Zero-downtime release

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/nskcomputerzone
git pull origin main

# backend
cd backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan down --render="errors::503" --retry=30
php artisan migrate --force
php artisan config:cache route:cache view:cache event:cache
php artisan queue:restart          # workers pick up new code on next cycle
php artisan up

# frontend — build first, swap second
cd ../frontend
npm ci
npm run build
pm2 reload nsk-web --update-env     # rolling reload, no dropped connections

sudo systemctl reload php8.3-fpm   # required: opcache.validate_timestamps=0
```

`pm2 reload` (not `restart`) restarts workers one at a time. `php artisan queue:restart`
signals workers to exit gracefully after their current job rather than killing them mid-send.

---

## 10. Post-deploy verification

```bash
curl -fsS https://api.nskcomputerzone.in/api/health | jq
curl -sI https://www.nskcomputerzone.in | grep -iE 'strict-transport|content-security|x-frame'
curl -fsS https://www.nskcomputerzone.in/sitemap.xml | head
curl -fsS https://www.nskcomputerzone.in/robots.txt

pm2 status && sudo supervisorctl status
php artisan queue:failed
```

Then, manually:
- [ ] Submit the contact form → confirm both emails arrive and the reference is returned
- [ ] Complete the PC Builder → confirm the enquiry appears in the admin panel
- [ ] Log into `/admin` → confirm the dashboard populates
- [ ] Open the AI assistant → confirm a reply, then trigger escalation with "speak to a human"
- [ ] Lighthouse on `/`, `/products`, `/products/[slug]` — target ≥ 95
- [ ] Rich Results Test on a product and a blog URL
- [ ] SSL Labs → A or better
- [ ] Submit 6 forms in one minute → expect a 429 on the sixth

---

## 11. Rollback

```bash
cd /var/www/nskcomputerzone
git log --oneline -5
git checkout <previous-sha>

cd backend && composer install --no-dev -o && php artisan config:cache route:cache
php artisan migrate:rollback --step=1     # only if the release added migrations
cd ../frontend && npm ci && npm run build && pm2 reload nsk-web
sudo systemctl reload php8.3-fpm
```

Database rollback is the risky half. Prefer **additive, backwards-compatible
migrations** — add a nullable column, deploy code that writes both, backfill, then
drop the old column in a *later* release. That way a rollback never needs a
destructive `migrate:rollback`.
