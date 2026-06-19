# Deploy to DreamHost (shared hosting)

The site is a **static Astro build**. The contact form posts to a small PHP
endpoint (`enviar.php`) that relays the message to `proveedores@rexeco.cl` over
authenticated SMTP. DreamHost shared hosting runs Apache + PHP, so no Node.js
runtime is needed in production.

## 1. Build

```bash
npm install
npm run build
```

This produces `dist/`, which already contains:

- the static site (HTML/CSS/JS),
- `dist/enviar.php` (copied from `public/enviar.php`),
- `dist/lib/PHPMailer/` (the bundled PHPMailer 7.x library).

## 2. Create the SMTP credentials file

Copy the template and fill in the real values:

```bash
cp config-smtp.example.php config-smtp.php
```

Edit `config-smtp.php` with the values from the **DreamHost panel** for the
`proveedores@rexeco.cl` mailbox:

- `host` — SMTP server (commonly `smtp.dreamhost.com`).
- `user` / `pass` — full mailbox address and its password.
- `secure` + `port` — must match: `ENCRYPTION_STARTTLS` + `587`, or
  `ENCRYPTION_SMTPS` + `465`.

`config-smtp.php` is gitignored — it must never be committed.

## 3. Upload

Upload to the DreamHost site directory (e.g. via SFTP):

- Everything inside `dist/` → into the **web root** (e.g. `~/rexeco.cl/`).
- `config-smtp.php` → **one level above the web root** (e.g. `~/config-smtp.php`
  if the web root is `~/rexeco.cl/`, so it is NOT publicly reachable).

> The endpoint loads the config from `__DIR__ . '/../config-smtp.php'`. If your
> layout differs, keep the config one directory above wherever `enviar.php`
> lands, always outside the public directory.

## 4. Verify in production

1. Open the contact form (`/canal-de-denuncias`), fill it in, and submit.
2. Confirm a message arrives at `proveedores@rexeco.cl`.
3. Confirm the **From** is `proveedores@rexeco.cl` and that **Reply** goes to the
   visitor's address (Reply-To).
4. If it lands in spam, review the `rexeco.cl` SPF / DKIM / DMARC records in the
   DreamHost panel.

## Notes

- The visitor's email is never used as `From` (that would break SPF/DMARC and
  bounce). It is set as `Reply-To` only.
- All fields are validated server-side in `enviar.php`; the email is checked
  with `FILTER_VALIDATE_EMAIL` to block header injection.
- SMTP errors are written to the PHP error log, never returned to the browser.
