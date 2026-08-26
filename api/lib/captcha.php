<?php
/**
 * Self-hosted image CAPTCHA.
 *
 * Stateless by design: the answer is never stored server-side. The endpoint
 * returns a picture of a code plus a signed token, and the token is an HMAC of
 * the code and an expiry. Verifying means re-signing what the visitor typed and
 * comparing — so there is no session to start, no cookie to set, and nothing to
 * clean up. That matters on a site that has just promised, in writing, that a
 * visitor's details are used only to answer their enquiry.
 *
 * Known limitation: without server state the same token and answer can be
 * replayed until it expires. The window is ten minutes and the per-IP rate
 * limit still applies, which is a reasonable trade for a shop contact form.
 * Making it single-use needs a store, and a store needs cleanup.
 *
 * Drawn with GD's built-in bitmap font rather than FreeType and a TTF. It is
 * uglier, and it is the only option guaranteed to exist wherever this is
 * deployed — a hardcoded /System/Library/Fonts path would work on this Mac and
 * break on the server.
 */

declare(strict_types=1);

/** No 0/O or 1/I/L: an unreadable code is a lost customer, not security. */
const CAPTCHA_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CAPTCHA_LENGTH   = 5;
const CAPTCHA_TTL      = 600; // seconds

/**
 * The signing key, generated once and kept in `settings`.
 *
 * Self-bootstrapping on purpose: this whole feature exists so the shop does not
 * need to register for anything, and making it depend on a hand-set key would
 * put it back to being one unset value away from broken.
 */
function captcha_secret(): string
{
    $row = query_one('SELECT value FROM settings WHERE name = ?', ['captcha_secret']);

    if ($row && is_string($row['value']) && strlen($row['value']) >= 32) {
        return $row['value'];
    }

    $secret = bin2hex(random_bytes(32));
    execute(
        'INSERT INTO settings (name, value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE value = VALUES(value)',
        ['captcha_secret', $secret]
    );

    return $secret;
}

function captcha_normalise(string $answer): string
{
    // Case and stray spaces are the visitor being human, not being wrong.
    return strtoupper(preg_replace('/\s+/', '', $answer) ?? '');
}

function captcha_sign(string $code, int $expires): string
{
    return hash_hmac('sha256', captcha_normalise($code) . '|' . $expires, captcha_secret());
}

/** @return array{token: string, image: string} image is a data: URI PNG. */
function captcha_issue(): array
{
    $code = '';
    $max  = strlen(CAPTCHA_ALPHABET) - 1;
    for ($i = 0; $i < CAPTCHA_LENGTH; $i++) {
        $code .= CAPTCHA_ALPHABET[random_int(0, $max)];
    }

    $expires = time() + CAPTCHA_TTL;

    return [
        'token' => $expires . '.' . captcha_sign($code, $expires),
        'image' => captcha_render($code),
    ];
}

/**
 * @return array{ok: bool, reason: string}
 */
function captcha_check(?string $token, ?string $answer): array
{
    if (!is_string($token) || !is_string($answer) || $token === '' || $answer === '') {
        return ['ok' => false, 'reason' => 'missing'];
    }

    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) {
        return ['ok' => false, 'reason' => 'malformed'];
    }

    [$expires, $signature] = [(int) $parts[0], $parts[1]];

    if ($expires < time()) {
        return ['ok' => false, 'reason' => 'expired'];
    }

    // hash_equals, not ===, so comparison time does not leak the signature.
    if (!hash_equals($signature, captcha_sign($answer, $expires))) {
        return ['ok' => false, 'reason' => 'mismatch'];
    }

    return ['ok' => true, 'reason' => 'verified'];
}

/** Draw the code, distorted enough to beat naive OCR, still readable. */
function captcha_render(string $code): string
{
    $w = 240;
    $h = 80;

    $img = imagecreatetruecolor($w, $h);
    imageantialias($img, true);

    // Site colours: near-black ground, near-white ink.
    $bg    = imagecolorallocate($img, 12, 12, 14);
    $ink   = imagecolorallocate($img, 232, 250, 254);
    $noise = imagecolorallocate($img, 52, 62, 68);
    imagefilledrectangle($img, 0, 0, $w, $h, $bg);

    // Interference first, so it sits behind the glyphs.
    for ($i = 0; $i < 7; $i++) {
        imageline($img, random_int(0, $w), random_int(0, $h), random_int(0, $w), random_int(0, $h), $noise);
    }
    for ($i = 0; $i < 260; $i++) {
        imagesetpixel($img, random_int(0, $w - 1), random_int(0, $h - 1), $noise);
    }

    /*
     * Each character is drawn on its own tile, scaled up hard from GD's small
     * built-in font, rotated, then copied across. Rotating per glyph rather
     * than the whole strip is what stops the code being one straight line an
     * OCR pass can segment easily.
     */
    $len  = strlen($code);
    $step = (int) (($w - 44) / $len);

    for ($i = 0; $i < $len; $i++) {
        $tile = imagecreatetruecolor(16, 20);
        imagefilledrectangle($tile, 0, 0, 16, 20, $bg);
        $tileInk = imagecolorallocate($tile, 232, 250, 254);
        // Font 5 is GD's largest built-in: 9x15 in a 16x20 tile.
        imagestring($tile, 5, 3, 2, $code[$i], $tileInk);

        $scaled = imagecreatetruecolor(52, 64);
        imagefilledrectangle($scaled, 0, 0, 52, 64, $bg);
        imagecopyresampled($scaled, $tile, 0, 0, 0, 0, 52, 64, 16, 20);

        $rotated = imagerotate($scaled, random_int(-18, 18), $bg);

        // Centred vertically with only slight jitter — the earlier version
        // dropped glyphs to the floor of the image and looked like a crop.
        $top = (int) (($h - imagesy($rotated)) / 2) + random_int(-4, 4);

        imagecopy(
            $img,
            $rotated,
            22 + $i * $step,
            $top,
            0,
            0,
            imagesx($rotated),
            imagesy($rotated)
        );

        imagedestroy($tile);
        imagedestroy($scaled);
        imagedestroy($rotated);
    }

    /*
     * One stroke across the top, in the noise colour rather than the ink
     * colour. Drawn in ink it was indistinguishable from the characters and
     * made the code genuinely hard for a person to read — which costs a
     * customer and buys almost nothing against a real solver.
     */
    imageline($img, 0, random_int(16, $h - 16), $w, random_int(16, $h - 16), $noise);

    ob_start();
    imagepng($img, null, 9);
    $png = (string) ob_get_clean();
    imagedestroy($img);

    return 'data:image/png;base64,' . base64_encode($png);
}
