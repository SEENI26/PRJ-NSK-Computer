-- NSK Computer Zone — schema
--
-- Scope note: the previous Laravel build modelled 43 tables. This is the subset
-- the application actually reads or writes today. Anything not backed by a real
-- feature was left out rather than carried over as dead structure.
--
-- Apply with:  mysql -u root nsk_computer_zone < api/schema.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Catalogue ──────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL,
  description   TEXT NULL,
  image         VARCHAR(255) NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categories_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(160) NOT NULL UNIQUE,
  name          VARCHAR(200) NOT NULL,
  category_slug VARCHAR(120) NOT NULL,
  brand         VARCHAR(120) NULL,
  summary       TEXT NULL,
  description   MEDIUMTEXT NULL,
  -- Nullable by design. The business publishes no prices; NULL renders as
  -- "Price on request". Never default this to 0 — that advertises free stock
  -- and breaches Google's structured-data policy. See docs/18-content-audit.md §4.
  price         DECIMAL(10,2) NULL DEFAULT NULL,
  image         VARCHAR(255) NULL,
  specs         JSON NULL,
  features      JSON NULL,
  is_featured   TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_products_category (category_slug),
  INDEX idx_products_active (is_active, is_featured),
  FULLTEXT KEY ft_products (name, summary, description, brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin-managed image overrides, keyed by product slug. Replaces the
-- localStorage-backed store the admin panel used before.
DROP TABLE IF EXISTS product_images;
CREATE TABLE product_images (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_slug  VARCHAR(160) NOT NULL,
  path          VARCHAR(255) NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_product_images_slug (product_slug, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Content ────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS services;
CREATE TABLE services (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  title       VARCHAR(200) NOT NULL,
  summary     TEXT NULL,
  description MEDIUMTEXT NULL,
  icon        VARCHAR(80) NULL,
  image       VARCHAR(255) NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS blog_posts;
CREATE TABLE blog_posts (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(160) NOT NULL UNIQUE,
  title        VARCHAR(240) NOT NULL,
  excerpt      TEXT NULL,
  body         LONGTEXT NULL,
  category     VARCHAR(120) NULL,
  -- House byline only. Six invented staff bylines were removed during the
  -- content audit; do not reintroduce named authors without consent.
  author_name  VARCHAR(160) NOT NULL DEFAULT 'NSK Computer Zone',
  image        VARCHAR(255) NULL,
  read_minutes INT NOT NULL DEFAULT 5,
  published_at DATETIME NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_blog_published (is_published, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS faqs;
CREATE TABLE faqs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question   VARCHAR(400) NOT NULL,
  answer     TEXT NOT NULL,
  category   VARCHAR(120) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Promotional posters managed from the admin panel.
DROP TABLE IF EXISTS offers;
CREATE TABLE offers (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT NULL,
  poster       VARCHAR(255) NULL,
  poster_alt   VARCHAR(255) NULL,
  cta_label    VARCHAR(120) NULL,
  cta_href     VARCHAR(255) NULL,
  starts_at    DATETIME NULL,
  ends_at      DATETIME NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_offers_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CRM ────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS enquiries;
CREATE TABLE enquiries (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference   VARCHAR(24) NOT NULL UNIQUE,
  name        VARCHAR(160) NOT NULL,
  email       VARCHAR(200) NULL,
  phone       VARCHAR(40) NULL,
  subject     VARCHAR(240) NULL,
  message     TEXT NOT NULL,
  source      ENUM('website','ai_assistant','pc_builder','phone','whatsapp') NOT NULL DEFAULT 'website',
  status      ENUM('new','in_progress','quoted','won','lost') NOT NULL DEFAULT 'new',
  priority    ENUM('low','normal','high') NOT NULL DEFAULT 'normal',
  build_spec  JSON NULL,
  notes       TEXT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_enquiries_status (status, created_at),
  INDEX idx_enquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS newsletter_subscribers;
CREATE TABLE newsletter_subscribers (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(200) NOT NULL UNIQUE,
  is_confirmed  TINYINT(1) NOT NULL DEFAULT 0,
  token         VARCHAR(64) NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── AI assistant ───────────────────────────────────────────────────────────

DROP TABLE IF EXISTS ai_conversations;
CREATE TABLE ai_conversations (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id    VARCHAR(64) NOT NULL,
  visitor_name  VARCHAR(160) NULL,
  visitor_email VARCHAR(200) NULL,
  visitor_phone VARCHAR(40) NULL,
  escalated     TINYINT(1) NOT NULL DEFAULT 0,
  input_tokens  INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS chat_messages;
CREATE TABLE chat_messages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT UNSIGNED NOT NULL,
  role            ENUM('user','assistant','system') NOT NULL,
  content         MEDIUMTEXT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_chat_conversation (conversation_id, id),
  CONSTRAINT fk_chat_conversation FOREIGN KEY (conversation_id)
    REFERENCES ai_conversations (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Admin ──────────────────────────────────────────────────────────────────

/*
 * Single-account design: this deployment has one administrator, so there is no
 * roles model and no user-management UI. If multiple staff logins are ever
 * needed, add a `role` column back and reintroduce the permission checks in
 * routes/admin/*.php — several endpoints currently assume the caller is the
 * owner.
 */
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(80) NOT NULL UNIQUE,
  name          VARCHAR(160) NOT NULL,
  email         VARCHAR(200) NULL,
  -- password_hash(), never plaintext. Seeded from a value you supply, not a
  -- hardcoded default.
  password_hash VARCHAR(255) NOT NULL,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  name       VARCHAR(120) NOT NULL PRIMARY KEY,
  value      TEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
