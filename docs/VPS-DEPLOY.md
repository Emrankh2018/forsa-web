# Running the website on the VPS

Written 2026-11-19 (Asia/Qatar), before the VPS exists. This covers **the website only**: one Node.js process behind Nginx. The database, sign-in and email sending are separate steps that start when the owner says the VPS is ready (`../../production/ROADMAP-VPS-READY.md`, "Left for the VPS"). No passwords or keys belong in this file or in the chat.

## What runs where

```
visitor ──HTTPS──> Nginx (443, certificate from Let's Encrypt)
                     └─> Node.js 24: apps/web/server.js on 127.0.0.1:3000 (systemd service "forsa-web")
```

- `next build` writes `apps/web/.next/standalone/`: the server and only the packages it needs. `scripts/package-standalone.mjs` copies the built static files and `public/` into it. That folder is the whole release; the server needs Node 24 and nothing else.
- Security headers come from `apps/web/next.config.ts`, so Vercel and the VPS send the same ones.
- Files here: `deploy/nginx/forsa.conf`, `deploy/systemd/forsa-web.service`, `apps/web/.env.example` (names of the settings).

## Settings

| Name | Read at | Value |
|---|---|---|
| `SITE_URL` | build | Public address, e.g. `https://forsa.qa`. Share images, canonical links and the sitemap use it |
| `FORSA_ENV` | build | Empty until go-live. `production` lets search engines index public pages |
| `NEXT_PUBLIC_CONTACT_EMAIL` | build | Optional; shown on `/contact` |
| `PORT`, `HOSTNAME` | run | `3000` and `127.0.0.1` (set in the service file) |

Build-time settings are baked into the pages, so change them, then rebuild.

## First setup (once, on a fresh Ubuntu 24.04 VPS)

Do these as a user with `sudo`, signed in with an SSH key (not a password).

1. System: `sudo apt update && sudo apt upgrade -y`, then `sudo apt install -y nginx certbot python3-certbot-nginx ufw`.
2. Firewall: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.
3. Node 24 from NodeSource: `curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash - && sudo apt install -y nodejs`, then check `node -v` shows v24.
4. A user for the site and its folders: `sudo useradd --system --create-home --home-dir /srv/forsa forsa`, `sudo mkdir -p /srv/forsa/releases /srv/forsa/shared`, `sudo chown -R forsa:forsa /srv/forsa`.
5. Service: copy `deploy/systemd/forsa-web.service` to `/etc/systemd/system/`, then `sudo systemctl daemon-reload && sudo systemctl enable forsa-web`.
6. Nginx: copy `deploy/nginx/forsa.conf` to `/etc/nginx/sites-available/`, replace `forsa.example` with the domain, `sudo ln -s /etc/nginx/sites-available/forsa.conf /etc/nginx/sites-enabled/`, remove the default site, `sudo nginx -t && sudo systemctl reload nginx`.
7. Domain: point the domain's A record (and AAAA if the VPS has IPv6) at the VPS, wait until it resolves, then `sudo certbot --nginx -d <domain> -d www.<domain>`. Certbot renews by itself.

## Each release

On the build machine (this repo, Node 24):

```bash
npm ci
SITE_URL=https://<domain> npm run build     # add FORSA_ENV=production only at go-live
npm run standalone                          # copies static files into the release folder
tar -C apps/web/.next/standalone -czf forsa-release.tgz .
```

On the VPS:

```bash
R=/srv/forsa/releases/$(date +%Y%m%d-%H%M)
sudo -u forsa mkdir -p "$R" && sudo -u forsa tar -C "$R" -xzf forsa-release.tgz
sudo -u forsa mkdir -p "$R/apps/web/.next/cache"
sudo ln -sfn "$R" /srv/forsa/current
sudo systemctl restart forsa-web
curl -fsS http://127.0.0.1:3000/api/health     # {"status":"ok"}
```

Keep the last three releases. **Roll back:** point `/srv/forsa/current` at the previous release folder and `sudo systemctl restart forsa-web`.

Logs: `journalctl -u forsa-web -f` (the site) and `/var/log/nginx/` (requests).

## Checks before calling a release live

- Here, before packing: `npm run check`, then `E2E_STANDALONE=1 npx playwright test` (the browser suite against the same standalone server the VPS runs).
- On the VPS: `/api/health` answers; `https://<domain>/ar` and `/en` open; `curl -I https://<domain>/ar` shows `strict-transport-security`, `content-security-policy` and `x-frame-options`; `http://` and `www.` redirect to `https://<domain>`.
- From here: `E2E_BASE_URL=https://<domain> npx playwright test` (the full suite against the live server; takes about 16 minutes).

## Go-live switch

Until the owner opens the site to the public, every page sends `noindex` and `robots.txt` blocks everything. At go-live: rebuild with `FORSA_ENV=production` and the final `SITE_URL`, release, then check `https://<domain>/robots.txt` allows the public pages and `https://<domain>/sitemap.xml` lists them. The signed-in areas, showcase and tester kit stay `noindex` and blocked either way.

## Uptime monitor

Point any uptime service (or a cron job) at `https://<domain>/api/health` every minute; it answers 200 with `{"status":"ok"}` while the site runs.
