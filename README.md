# The Fireside, Eatery & Venue

Website for The Fireside, a family restaurant and events venue at 41 Circular Drive, Overbaakens, Gqeberha: story, full menu, weekly specials, gallery, venue hire, online table requests and contact.

- **Domain:** thefireside.co.za
- **Compose project name:** `thefireside`
- **Host port (VPS Nginx forwards here):** `8102`

## How it fits together

```
Browser
   |
VPS Nginx  (HTTPS, domain; lives on the server, not in this project)
   |
frontend container  (Nginx: serves the built React site)
   |-- /api/*  -->  backend container  (Express API)
                        |
                    database container  (MySQL, data kept in a Docker volume)
```

Only the frontend is reachable from the server itself (on `127.0.0.1:8102`). The API and the database
can only be reached from inside this site's own Docker network. Every website on the VPS is its own stack like
this one, with its own database, so sites cannot affect each other.

## Technologies

| Part | Built with |
| --- | --- |
| Frontend | React (JavaScript), Vite, Tailwind CSS, Motion for React, React Router, Axios, Lucide React |
| Backend | Node.js, Express, Sequelize, express-validator, Helmet, express-rate-limit |
| Database | MySQL 8.4 |
| Hosting | Docker Compose, Nginx |

## Folders

```
frontend/   the website people see
  src/pages        one file per page
  src/components   reusable pieces (ui/ = buttons, fields, cards ...)
  src/layouts      shared page frames (header, footer)
  src/services     api.js: the one place that talks to the backend
  src/styles       index.css: colours, fonts and easing (the design tokens)
  nginx/           how the site and /api are served in production
backend/    the API and business logic
  src/routes -> controllers -> services -> models   one request, top to bottom
  src/migrations   every change to the database structure, in order
  src/seeders      starting data
docker-compose.yml       the production stack
docker-compose.dev.yml   extra settings for local development only
.env.example             list of settings; copy to .env
scripts/smoke-test.sh    builds the stack and checks it works
```

## Settings (.env)

```bash
cp .env.example .env
```

Open `.env` and set the name, port and passwords. Generate each password with:

```bash
openssl rand -base64 32
```

`.env` holds real passwords. It is ignored by git and must never be committed or sent to anyone.

### Reservation emails (SMTP)

Table requests are always saved in the database. To also email them, fill in `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` with the restaurant's mail account, and set `MAIL_TO` to the address that
should receive new requests (default `Debbie@thefireside.co.za`). With SMTP set, each request sends:

- the restaurant a "New table request #12" email (reply goes straight to the guest), and
- the guest a "We have your table request" email that says clearly it is **not yet a confirmation**.

Without SMTP, requests are saved and nobody is emailed. **Set SMTP before going live**, or check the list below daily.

See every request, newest first:

```bash
docker compose exec database sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT id, created_at, name, guests, date, time, phone, email, status, requests FROM reservations ORDER BY id DESC LIMIT 50;"'
```

Pre-ordered dishes are in the `items` column (JSON). Contact-page messages are in the `enquiries` table:

```bash
docker compose exec database sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT id, created_at, name, email, subject, message FROM enquiries ORDER BY id DESC LIMIT 50;"'
```

Mark a table request as confirmed (or `declined`):

```bash
docker compose exec database sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "UPDATE reservations SET status=\'confirmed\' WHERE id=12;"'
```

## Run it

Build and start (also the command for the first launch on the VPS):

```bash
docker compose up -d --build
```

Check that all three containers are `healthy`:

```bash
docker compose ps
```

Stop the site (the database is kept):

```bash
docker compose down
```

> Never add `-v` to `down` unless you mean to delete the database. `docker compose down -v` erases all saved data.

Full check of the production build:

```bash
./scripts/smoke-test.sh
```

## Logs

```bash
docker compose logs -f backend
```

Swap `backend` for `frontend` or `database`, or leave the name off to see all three.

## Database migrations

Migrations run automatically every time the backend container starts. To run or inspect them by hand:

```bash
docker compose exec backend npm run migrate
```

```bash
docker compose exec backend npm run migrate:status
```

Undo the most recent migration:

```bash
docker compose exec backend npm run migrate:undo
```

Load starting data (only when the project has seeders):

```bash
docker compose exec backend npm run seed
```

## The API

The API is not public on its own port. It is reached through the site: `https://thefireside.co.za/api/...`

Health check, from the VPS:

```bash
curl http://127.0.0.1:8102/api/health
```

Expected: `{"success":true,"message":"API is operational","database":"connected"}`

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | Is the API up and connected to the database? |
| POST | `/api/reservations` | A table request from the website. Body: `name`, `email`, `phone`, `guests` (1-40), `date` (YYYY-MM-DD, today to 6 months ahead, not Mondays), `time` (HH:MM within trading hours, last booking an hour before closing), `requests` (optional). Returns `201` with a reference number, or `422` with a message per field. Optional `items`: dishes pre-ordered from the menu, `[{ name, qty (1-30), price }]`, up to 40. Limited to 10 requests per hour per visitor, with a hidden spam trap. |
| POST | `/api/enquiries` | A message from the contact page. Body: `name`, `email`, `phone` (optional), `subject` (one of the five on the form), `message` (10-3000 characters). Saved, and emailed to `MAIL_TO` when SMTP is set. Same rate limit and spam trap. |

## Back up the database

```bash
mkdir -p backups && docker compose exec -T database sh -c 'exec mysqldump --single-transaction --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' | gzip > "backups/$(date +%F-%H%M).sql.gz"
```

Restore a backup (replaces the current data):

```bash
gunzip -c backups/FILE.sql.gz | docker compose exec -T database sh -c 'exec mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

Take a backup before every update. Keep copies somewhere other than the VPS.

## Deploying with GitHub Actions

Push to `main` and `.github/workflows/ci-cd.yml` does the rest:

1. **verify:** builds both apps and runs `scripts/smoke-test.sh` against the real Docker stack.
2. **image:** pushes `ghcr.io/<owner>/<repo>-frontend` and `-backend`, tagged `sha-<commit>`.
3. **deploy:** over SSH it runs `deploy/deploy.sh`, which backs up the database and uploads, pulls the images,
   restarts, waits for all three containers to be healthy, and rolls back to the previous images by itself if
   they aren't.

Pull requests only run step 1.

One-time setup:

1. **Repository secrets:** `DEPLOY_HOST`, `DEPLOY_USER` (in the docker group), `DEPLOY_SSH_KEY`, `DEPLOY_PATH`
   (e.g. `/srv/thefireside`), and `DEPLOY_PORT` if it isn't 22. Optional variable: `SITE_URL`.
2. **On the VPS:** create `DEPLOY_PATH` containing a filled-in `.env` (new passwords, a free `FRONTEND_PORT`).
3. **Log the VPS in to GHCR once**, with a token that has only `read:packages`:

```bash
echo "<token>" | docker login ghcr.io -u <github-username> --password-stdin
```

4. **Switch deploying on:** add the repository variable `DEPLOY_ENABLED` = `true`. Until it's set, the deploy job is
   skipped, so pushes stay green while the server isn't ready.

Roll back by hand to an earlier commit's images:

```bash
./deploy/deploy.sh ghcr.io/<owner>/<repo>-frontend:sha-<old> ghcr.io/<owner>/<repo>-backend:sha-<old>
```

## Update and redeploy

Without GitHub, on a server that builds from the source:

1. Back up the database (above).
2. Get the new version of the project onto the VPS (replace the project files, keeping `.env`).
3. Rebuild and restart. New migrations are applied on start:

```bash
docker compose up -d --build
```

4. Confirm everything is healthy:

```bash
docker compose ps
```

5. Clear out old image layers:

```bash
docker image prune -f
```

## Local development

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build database backend
```

```bash
cd frontend && npm install && npm run dev
```

The site runs on the address Vite prints, with live reload. `/api` is forwarded to the backend container.

## VPS Nginx (the server's own reverse proxy)

This project does not touch the VPS-level Nginx. Add a server block like this on the VPS by hand, then reload Nginx.
The certificate paths assume Let's Encrypt; adjust them to how SSL is managed on the server.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name thefireside.co.za www.thefireside.co.za;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;   # Nginx older than 1.25.1: remove this line and use "listen 443 ssl http2;"
    server_name thefireside.co.za www.thefireside.co.za;

    ssl_certificate     /etc/letsencrypt/live/thefireside.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/thefireside.co.za/privkey.pem;

    # Keep in step with client_max_body_size in frontend/nginx/default.conf
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:8102;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Only if this site uses WebSockets:
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection "upgrade";
    }
}
```

## Technical decisions, in plain language

- **Content lives in plain files.** The menu, specials, hours and contact details are in `frontend/src/content/`
  (`menu.js`, `specials.js`, `site.js`). Changing a price is a one-line edit and a redeploy. They were transcribed
  from the restaurant's current website and menu boards (November 2026). There is no admin area because the brief
  didn't ask for one; if the restaurant wants to edit the menu themselves, that is the next feature to add.
- **Trading hours are written down twice on purpose.** `frontend/src/content/site.js` (what visitors see and which
  times the form offers) and `backend/src/config/hours.js` (what the server accepts). Change both together.
- **A table request is a request, not a booking.** The site never pretends to confirm a table: there is no live
  table plan behind it. Requests are saved first, then emailed, and the guest is told the restaurant will confirm.
- **Photos are the restaurant's own.** They came from the current website and are exported as WebP at two sizes by
  `tools/photos.py` (the originals are in `assets-source/photos/`). To swap a photo, change its line in `CAST` at the top
  of that script and run `python3 tools/photos.py assets-source/photos`.
- **Background music** plays only when a visitor presses the Music button (bottom left); browsers block sound
  before a click anyway. The five tracks are in `frontend/public/music/` as 160kbps AAC (about 3 MB each), encoded
  from the WAV masters with macOS `afconvert`. The playlist is `frontend/src/content/music.js`. They are licensed
  stock tracks: make sure each licence is registered for this website before going live.
- **The logo is the original,** recoloured cream and brass for dark backgrounds (`frontend/src/assets/brand/`).
  Ask the restaurant for the vector logo; the current one is traced from a 780px JPG.
- **Fonts are self-hosted** (Cormorant Garamond for headings, Manrope for text), so the site doesn't depend on Google Fonts.
- **Motion** uses Motion for React: one easing and set of durations in `frontend/src/utils/motion.js`. Visitors who
  ask their device for less motion get fades only.
- **Search engines and link previews.** The site is rendered in the browser. `index.html` carries the title,
  description, share image and restaurant details (opening hours, address, phone) in a format Google reads.
