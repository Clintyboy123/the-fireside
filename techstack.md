# The Fireside: the tech stack, explained

A plain-language walkthrough of how thefireside.co.za is built, for whoever looks after it next.
The short version of the commands is in `README.md`.

## 1. The idea in one paragraph

The Fireside's own line is the design: *a home away from home, just without the dishes*. The site is a dark,
warm room lit by one light source, antique gold, the way a fire lights faces at a table. Everything is built
from the restaurant's real material: its photography, its menu boards, its weekly specials and the dictionary
definition of "fireside" it already prints on its menu. Visitors can read the menu, see the room, and send a
table request that is saved in a database and emailed to the restaurant.

## 2. How a visit works

```
Visitor's browser
   |  https://thefireside.co.za
VPS Nginx (HTTPS certificate, the domain)            <- on the server, not in this project
   |  127.0.0.1:8102
frontend container: Nginx serving the built React site
   |  /api/* only
backend container: Express API (validates, saves, emails)
   |
database container: MySQL 8.4 (data in a Docker volume)
```

Pages (Home, Menu, Our Story) are served by the frontend container. When someone sends a table request, the
browser posts it to `/api/reservations` on the same domain; Nginx passes it to the API over Docker's private
network. The API and the database are never reachable from the internet.

## 3. The three containers

| Container | Job | Reachable from |
| --- | --- | --- |
| `frontend` | Serves the site, forwards `/api` | The VPS itself only (`127.0.0.1:8102`) |
| `backend` | Checks and saves table requests, sends email | Inside the stack only |
| `database` | Stores table requests | Inside the stack only |

The project name `thefireside` keeps its containers, network and data separate from every other site on the VPS.

## 4. Frontend: the website people see

- React + Vite, styled with Tailwind CSS. All colours, fonts, type sizes and spacing are named once in
  `frontend/src/styles/index.css` (the design system). All animation timing is in `frontend/src/utils/motion.js`.
- **Content files** (`frontend/src/content/`): `menu.js` (every dish and price), `specials.js` (the week),
  `site.js` (address, phone, hours, occasions, sister companies), `photos.json` (which photo is used where).
- **Sections** (`frontend/src/components/sections/`): Hero, Story, MenuPreview, Signatures, Week, Gallery,
  Occasions, Reservation, Visit. Pages in `frontend/src/pages/` put them together.
- **Motion:** headings rise word by word out of a mask, photos are revealed by a lifting curtain and drift
  slightly on scroll, the hero photo slowly pushes in. Visitors who
  ask their device for reduced motion get simple fades.
- **Photos:** the restaurant's own photography, exported at two sizes as WebP by `tools/photos.py`, lazy-loaded
  below the first screen.

## 5. Backend: the API

Express with one feature, reservations, built in layers:

```
routes/reservation.routes.js      which fields are required and what is valid
controllers/reservation.controller.js
services/reservation.service.js   save, then email the restaurant and the guest
services/mail.service.js          SMTP (optional; without it requests are only saved)
models/reservation.js             the table
config/hours.js                   trading hours, so no one can book a closed day or time
```

Validation rules: name, a real-looking email and phone, 1 to 40 guests, a date from today up to six months
ahead (not a Monday), and a time between opening and one hour before closing.

## 6. Database

One table, `reservations`: name, email, phone, guests, date, time, requests, `status` (pending / confirmed /
declined), `notified_at` (when the emails went out) and timestamps. Created by a migration that runs
automatically when the backend starts.

## 7. Security

- Only the frontend port is published, and only on `127.0.0.1`.
- Every field is validated on the server; unexpected fields are dropped.
- 10 table requests per hour per visitor, plus a hidden "honeypot" field that catches spam bots.
- Secrets (database passwords, SMTP password) live only in `.env` on the server, never in the website code.
- Security headers from Helmet (API) and Nginx (pages).

## 8. Testing

`./scripts/smoke-test.sh` builds the real production stack and checks it end to end (see README). The booking
form was also tested by hand in the browser: empty submit, invalid fields, closed day, a real request and the
confirmation screen, at desktop and phone widths.

## 9. Deployment

Identical to the other sites on this VPS: GitHub Actions builds the images, pushes them to GHCR and deploys over
SSH with `deploy/deploy.sh` (backup first, health check, automatic rollback). See README, "Deploying with
GitHub Actions". The deploy job stays off until the repository variable `DEPLOY_ENABLED` is `true`.

## 10. Known limits and what's next

- **No admin screen.** Requests are emailed (once SMTP is set) and can be listed with the command in the
  README. A small password-protected bookings page is the natural next feature.
- **Content is in code files.** Menu and price changes need a redeploy. A self-edit option could follow.
- **Signature dish photos are representative.** They are the restaurant's own shots of each kind of dish,
  not confirmed photos of those exact dishes; swap them when the restaurant supplies the right shots.
- **Logo** is traced from a small JPG; replace with the vector original.
