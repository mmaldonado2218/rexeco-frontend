<?php

/**
 * SMTP configuration template for the contact form endpoint (enviar.php).
 *
 * DEPLOYMENT:
 *   Copy this file to "config-smtp.php" and fill in the real values.
 *   Upload config-smtp.php ONE level ABOVE the web root on DreamHost
 *   (e.g. ~/rexeco.cl/config-smtp.php when the site is served from
 *   ~/rexeco.cl/dist or ~/rexeco.cl). It must NEVER live inside the public
 *   directory and must NEVER be committed to git.
 *
 * Confirm the exact host / port / encryption in the DreamHost panel:
 *   - STARTTLS  -> port 587 -> PHPMailer::ENCRYPTION_STARTTLS
 *   - SMTPS/TLS -> port 465 -> PHPMailer::ENCRYPTION_SMTPS
 */

use PHPMailer\PHPMailer\PHPMailer;

return [
    // SMTP server from the DreamHost panel (commonly smtp.dreamhost.com).
    'host'   => 'smtp.dreamhost.com',

    // Authenticated mailbox (full email address) and its password.
    'user'   => 'proveedores@rexeco.cl',
    'pass'   => 'CHANGE_ME',

    // Encryption + port must match (see note above).
    'secure' => PHPMailer::ENCRYPTION_STARTTLS,
    'port'   => 587,

    // From must be the authenticated mailbox for SPF/DMARC alignment.
    'from'   => 'proveedores@rexeco.cl',

    // Destination inbox for the quote requests.
    'to'     => 'proveedores@rexeco.cl',
];
