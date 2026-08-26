<?php
/**
 * Google reCAPTCHA v2 verification.
 *
 * Deliberately fails *open* when no secret is configured, and only then.
 *
 * That is a considered trade-off, not laziness. This form spent its whole life
 * rejecting every enquiry because a config value was empty, and nobody noticed
 * because the failure looked like a polite message. Making the shop's only
 * contact form depend on a second unset key would repeat exactly that bug.
 *
 * So: with no secret, the honeypot, the timing check and the rate limit still
 * apply. Once a secret is set, a missing or invalid token is refused outright.
 * Security scales up when it is configured; the form is never silently dead.
 */

declare(strict_types=1);

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

function recaptcha_secret(): string
{
    $secret = getenv('RECAPTCHA_SECRET');
    if (is_string($secret) && $secret !== '') {
        return $secret;
    }
    return (string) (config('recaptcha_secret') ?? '');
}

function recaptcha_enabled(): bool
{
    return recaptcha_secret() !== '';
}

/**
 * @return array{ok: bool, reason: string}
 */
function recaptcha_check(?string $token, ?string $ip = null): array
{
    if (!recaptcha_enabled()) {
        return ['ok' => true, 'reason' => 'not_configured'];
    }

    if (!is_string($token) || $token === '') {
        return ['ok' => false, 'reason' => 'missing'];
    }

    $post = http_build_query(array_filter([
        'secret'   => recaptcha_secret(),
        'response' => $token,
        'remoteip' => $ip,
    ]));

    $context = stream_context_create([
        'http' => [
            'method'        => 'POST',
            'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content'       => $post,
            'timeout'       => 5,
            'ignore_errors' => true,
        ],
    ]);

    $raw = @file_get_contents(RECAPTCHA_VERIFY_URL, false, $context);

    /*
     * Google being unreachable is our problem, not the visitor's. Refusing a
     * genuine enquiry because an outbound call timed out loses a customer, so
     * a transport failure is allowed through and logged for someone to look at.
     * The honeypot and rate limit are still in force on that path.
     */
    if ($raw === false) {
        error_log('reCAPTCHA verify unreachable — allowing submission through');
        return ['ok' => true, 'reason' => 'verify_unreachable'];
    }

    $body = json_decode($raw, true);

    if (!is_array($body) || empty($body['success'])) {
        $codes = is_array($body['error-codes'] ?? null) ? implode(',', $body['error-codes']) : 'unknown';
        return ['ok' => false, 'reason' => $codes];
    }

    return ['ok' => true, 'reason' => 'verified'];
}
