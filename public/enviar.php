<?php

declare(strict_types=1);

/**
 * Contact form mail endpoint.
 *
 * Receives a JSON POST from the static site's ContactForm and relays it to the
 * sales inbox via authenticated SMTP (DreamHost). Runs on DreamHost shared
 * hosting (Apache + PHP); the Astro site is fully static and posts here.
 *
 * Security notes:
 * - Credentials live in config-smtp.php ONE level above the web root, never in
 *   this file and never committed to git.
 * - From is always the authenticated mailbox (SPF/DMARC aligned). The visitor's
 *   address is set as Reply-To only.
 * - Every field is validated server-side; the email is checked with
 *   FILTER_VALIDATE_EMAIL to prevent header injection in Reply-To.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/lib/PHPMailer/src/Exception.php';
require __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/email-template.php';

/**
 * Send a JSON response and stop. Headers must be emitted before any output.
 */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// Only POST is allowed.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Load SMTP credentials from outside the web root.
$configPath = __DIR__ . '/../config-smtp.php';
if (!is_file($configPath)) {
    error_log('enviar.php: missing config-smtp.php at ' . $configPath);
    respond(500, ['ok' => false, 'error' => 'Server configuration error']);
}
$cfg = require $configPath;

// Parse the JSON body. The fetch sends application/json, so it is NOT in $_POST.
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid request body']);
}

// Server-side validation (never trust the client).
$nombre   = trim((string) ($data['nombre'] ?? ''));
$empresa  = trim((string) ($data['empresa'] ?? ''));
$telefono = trim((string) ($data['telefono'] ?? ''));
$email    = trim((string) ($data['email'] ?? ''));
$mensaje  = trim((string) ($data['mensaje'] ?? ''));

$errors = [];
if ($nombre === '')   { $errors[] = 'nombre'; }
if ($empresa === '')  { $errors[] = 'empresa'; }
if ($telefono === '') { $errors[] = 'telefono'; }
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Validation failed', 'fields' => $errors]);
}

// Branded HTML body (table-based, inline styles — see email-template.php).
$body = render_contact_email([
    'nombre'   => $nombre,
    'empresa'  => $empresa,
    'telefono' => $telefono,
    'email'    => $email,
    'mensaje'  => $mensaje,
]);

$altBody = "Nueva cotización desde la web\n\n"
    . "Nombre: {$nombre}\n"
    . "Empresa: {$empresa}\n"
    . "Teléfono: {$telefono}\n"
    . "Email: {$email}\n"
    . "Producto a cotizar:\n{$mensaje}\n";

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $cfg['host'];
    $mail->Port = (int) $cfg['port'];
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    // Apply encryption only when configured (DreamHost: STARTTLS on 587).
    if (!empty($cfg['secure'])) {
        $mail->SMTPSecure = $cfg['secure'];
    }
    // Authenticate only when credentials are provided.
    if (!empty($cfg['user'])) {
        $mail->SMTPAuth = true;
        $mail->Username = $cfg['user'];
        $mail->Password = $cfg['pass'];
    }

    // From must be the authenticated mailbox (SPF/DMARC aligned).
    $mail->setFrom($cfg['from'], 'Rexeco - Web');
    // Where the quote requests land.
    $mail->addAddress($cfg['to']);
    // Replying to the email goes straight to the visitor.
    $mail->addReplyTo($email, $nombre);

    $mail->isHTML(true);
    $mail->Subject = 'Nueva cotización desde la web';
    $mail->Body    = $body;
    $mail->AltBody = $altBody;

    $mail->send();
} catch (Exception $ex) {
    // ErrorInfo holds the SMTP detail; log it but never expose it to the client.
    error_log('enviar.php PHPMailer error: ' . $mail->ErrorInfo);
    respond(500, ['ok' => false, 'error' => 'No se pudo enviar el correo']);
}

respond(200, ['ok' => true]);
