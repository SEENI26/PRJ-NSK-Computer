<?php
/** POST /v1/admin/upload — multipart image upload. */

declare(strict_types=1);

require_admin();

if (empty($_FILES['file'])) {
    fail(422, 'No file was uploaded.', ['file' => ['A file is required.']]);
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $reason = match ($file['error']) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The file is too large.',
        UPLOAD_ERR_PARTIAL                        => 'The upload was interrupted.',
        default                                   => 'The upload failed.',
    };
    fail(422, $reason, ['file' => [$reason]]);
}

if ($file['size'] > 5 * 1024 * 1024) {
    fail(422, 'Images must be 5 MB or smaller.', ['file' => ['Maximum size is 5 MB.']]);
}

/*
 * Trust the sniffed MIME type, never the client-supplied name or type — both
 * are attacker-controlled. The extension is then derived from the sniffed type,
 * so a PHP file renamed .webp cannot land in a web-served directory.
 */
$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';

if (!isset($allowed[$mime])) {
    fail(422, 'Only JPEG, PNG, WebP and GIF images are accepted.', [
        'file' => ['Unsupported image type.'],
    ]);
}

$dir = __DIR__ . '/../../uploads';
if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
    error_log('Could not create uploads directory: ' . $dir);
    fail(500, 'Upload storage is unavailable.');
}

$name = date('Ymd') . '-' . bin2hex(random_bytes(8)) . '.' . $allowed[$mime];

if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
    error_log('move_uploaded_file failed for ' . $name);
    fail(500, 'Could not store the upload.');
}

@chmod($dir . '/' . $name, 0644);

json_out([
    'data' => [
        'path' => 'uploads/' . $name,
        'url'  => '/uploads/' . $name,
        'mime' => $mime,
        'size' => (int) $file['size'],
    ],
], 201);
