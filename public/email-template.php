<?php

declare(strict_types=1);

/**
 * Branded HTML email template for the contact form notification.
 *
 * Email clients (Outlook, Gmail, Apple Mail) do not support flexbox/grid,
 * external stylesheets, or reliably honor <style> blocks. So this template is
 * built with tables + inline styles, the portable approach for HTML email.
 * It mirrors the Rexeco brand palette and typography from src/styles/global.css
 * (Rajdhani headings, DM Sans body) without reusing Tailwind classes.
 *
 * @param array{nombre:string,empresa:string,telefono:string,email:string,mensaje:string} $data
 *        Raw user input. The template escapes every value with htmlspecialchars.
 * @return string Full HTML document for the email body.
 */
function render_contact_email(array $data): string
{
    // Brand tokens (kept in sync with src/styles/global.css @theme).
    $red   = '#CC0A26';
    $dark  = '#0E1714';
    $text  = '#3C3C3C';
    $light = '#F5F5F5';
    $border = '#E5E5E5';

    // Web fonts are not loaded by mail clients; declare brand fonts first with
    // safe fallbacks so the layout still reads as Rexeco where supported.
    $headingFont = "'Rajdhani', 'Arial Narrow', Arial, sans-serif";
    $bodyFont    = "'DM Sans', Arial, Helvetica, sans-serif";

    $e = static fn (string $v): string => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');

    $nombre   = $e($data['nombre'] ?? '');
    $empresa  = $e($data['empresa'] ?? '');
    $telefono = $e($data['telefono'] ?? '');
    $email    = $e($data['email'] ?? '');
    $mensaje  = nl2br($e($data['mensaje'] ?? ''));
    if (trim((string) ($data['mensaje'] ?? '')) === '') {
        $mensaje = '<span style="color:#999">— sin detalle —</span>';
    }

    // One labelled data row.
    $row = static function (string $label, string $value) use ($dark, $text, $border, $headingFont, $bodyFont): string {
        return '<tr>'
            . '<td style="padding:14px 24px;border-bottom:1px solid ' . $border . ';'
            . 'font-family:' . $headingFont . ';font-weight:600;text-transform:uppercase;'
            . 'letter-spacing:1px;font-size:12px;color:' . $dark . ';width:160px;'
            . 'vertical-align:top">' . $label . '</td>'
            . '<td style="padding:14px 24px;border-bottom:1px solid ' . $border . ';'
            . 'font-family:' . $bodyFont . ';font-size:15px;color:' . $text . ';'
            . 'vertical-align:top">' . $value . '</td>'
            . '</tr>';
    };

    return '<!DOCTYPE html>'
        . '<html lang="es"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<title>Nueva cotización</title></head>'
        . '<body style="margin:0;padding:0;background-color:' . $light . ';">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        . 'style="background-color:' . $light . ';padding:24px 0;">'
        . '<tr><td align="center">'

        // Card container (600px is the safe email width).
        . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" '
        . 'style="width:600px;max-width:600px;background-color:#FFFFFF;'
        . 'border-top:4px solid ' . $red . ';">'

        // Header band.
        . '<tr><td style="background-color:' . $dark . ';padding:28px 24px;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
        . '<td style="font-family:' . $headingFont . ';font-weight:700;font-size:24px;'
        . 'letter-spacing:2px;text-transform:uppercase;color:#FFFFFF;">REXECO</td>'
        . '<td align="right" style="font-family:' . $bodyFont . ';font-size:12px;'
        . 'color:rgba(255,255,255,0.6);">Canal de cotizaciones</td>'
        . '</tr></table></td></tr>'

        // Title.
        . '<tr><td style="padding:28px 24px 8px 24px;">'
        . '<h1 style="margin:0;font-family:' . $headingFont . ';font-weight:700;'
        . 'font-size:22px;text-transform:uppercase;letter-spacing:1px;color:' . $dark . ';">'
        . 'Nueva cotización desde la web</h1>'
        . '<p style="margin:8px 0 0 0;font-family:' . $bodyFont . ';font-size:14px;'
        . 'color:' . $text . ';">Un cliente envió una solicitud a través del formulario de contacto.</p>'
        . '</td></tr>'

        // Data table.
        . '<tr><td style="padding:16px 0 8px 0;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        . $row('Nombre', $nombre)
        . $row('Empresa', $empresa)
        . $row('Teléfono', $telefono)
        . $row('Email', '<a href="mailto:' . $email . '" style="color:' . $red . ';text-decoration:none;">' . $email . '</a>')
        . $row('Producto a cotizar', $mensaje)
        . '</table></td></tr>'

        // CTA: reply directly to the visitor.
        . '<tr><td style="padding:20px 24px 28px 24px;">'
        . '<a href="mailto:' . $email . '" '
        . 'style="display:inline-block;background-color:' . $red . ';color:#FFFFFF;'
        . 'font-family:' . $headingFont . ';font-weight:700;text-transform:uppercase;'
        . 'letter-spacing:1px;font-size:13px;padding:14px 28px;text-decoration:none;">'
        . 'Responder al cliente</a></td></tr>'

        . '</table>'

        // Footer.
        . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" '
        . 'style="width:600px;max-width:600px;">'
        . '<tr><td style="padding:20px 24px;font-family:' . $bodyFont . ';font-size:12px;'
        . 'color:#999;text-align:center;">'
        . 'Grupo Rexeco — Santa Margarita 01821, San Bernardo, Santiago<br>'
        . 'Este mensaje se generó automáticamente desde rexeco.cl'
        . '</td></tr></table>'

        . '</td></tr></table>'
        . '</body></html>';
}
