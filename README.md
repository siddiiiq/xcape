# Xcape.FOMO — Travel Community Platform

A cinematic travel community platform: a public site for discovering places, stories,
reels and the crew behind it, customer accounts with trip booking and payments
(Razorpay + Cash on Delivery), an Express + MongoDB API, and an admin dashboard for
managing every piece of content — including trips, bookings, and customers — without
touching code.

```
travel-community/
├── frontend/   Public website        (React + Vite + Tailwind)
├── backend/    REST API              (Express + MongoDB + Mongoose)
├── admin/      Admin dashboard       (React + Vite + Tailwind)
```

All three apps are independently runnable and use plain JavaScript/JSX — no TypeScript.

---

## 1. Architecture

- **frontend** — the public site. Fetches everything (places, stories, founders,
  reels, YouTube videos, site settings) from the backend API. If a section has no
  content yet, it shows an honest empty state instead of fake placeholder data.
- **backend** — a REST API backed by MongoDB. Handles auth (JWT), image uploads
  (Multer → Cloudinary), the "Join the Crew" flow (MongoDB + email via Nodemailer),
  and every CRUD operation the admin needs.
- **admin** — a CMS-style dashboard. Requires login. Lets a non-developer add a
  place with a story, cover image, and a full photo gallery (each photo can carry
  its own Instagram link), manage founders, reels, YouTube videos, review member
  applications, and edit site-wide settings (brand name, tagline, socials, etc).

Data flows one way: whatever's added/edited/deleted in the admin is read live by the
public site on next load. There's no separate "publish" step beyond the
Published/Draft toggle on each item.

### Two separate identity systems

There are two completely independent login systems, sharing nothing but the
backend and (optionally) the same `JWT_SECRET`:

- **Admin** (`/admin/login`) — the single admin account, seeded via
  `npm run seed:admin`. Its JWT is checked against the `Admin` collection only.
- **Customer** (`/sign-in`, `/join`) — real customer accounts on the public
  site. Its JWT carries an explicit `role: "customer"` claim and is checked
  against the `Customer` collection only. An admin token can never satisfy a
  customer route, and vice versa — they're structurally incapable of
  crossing over, not just hidden behind a UI toggle.

**"Join Community" creates a customer account.** Filling out the Join form
does two things in one request: it creates (or reuses) the community/lead
record — the existing `Member` model and admin Members page are untouched —
and creates a `Customer` account (hashed password, JWT issued immediately).
If that email already has an account, nothing is created or overwritten; the
person is told to sign in instead.

### Booking & payment flow

1. A customer browses `/trips` (public) and opens a trip.
2. Booking requires being signed in — an unauthenticated visitor sees
   "Create an account to continue" with links that remember which trip they
   were trying to book, so they land right back on it after registering/signing in.
3. On checkout, the backend re-validates everything itself: trip exists and
   is published, seats are available (atomic check-and-decrement, so two
   people can never book the last seat), and the total is
   `trip.price × seats` computed server-side — the frontend's numbers are
   never trusted.
4. **COD** confirms the booking immediately (`bookingStatus: CONFIRMED`,
   `paymentStatus: PENDING`) — no gateway involved, works with zero payment
   configuration.
5. **UPI/Card** creates a Razorpay order and opens their checkout widget.
   The booking stays `PENDING` until `POST /api/bookings/:id/verify`
   confirms the payment signature **server-side** — a frontend "success"
   message is never enough on its own to mark something paid.
6. Either way, a confirmation email goes to the customer (and the admin, if
   `NOTIFY_ADMIN_ON_JOIN=true`) once the booking is actually confirmed.

---

## 2. Requirements

- Node.js 18+
- A MongoDB database (local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Cloudinary](https://cloudinary.com) account (free tier is enough) — for image/video uploads
- An email account for Nodemailer (a Gmail address with an
  [App Password](https://myaccount.google.com/apppasswords) is the easiest option)
- Optional: a [Razorpay](https://razorpay.com) account for real UPI/Card payments —
  not required to run the app or test the full booking flow via COD

The site will still run without Cloudinary/email/payment gateway configured —
uploads, emails, and online payments simply degrade gracefully (see
Troubleshooting) — so you can get everything running and wire up real
credentials after.

---

## 3. Environment Variables

Each app has its own `.env`, copied from `.env.example`. **Never commit the real `.env` files** — they're already in `.gitignore`.

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `JWT_SECRET` | A long random string — signs **both** admin and customer tokens (they're kept separate by an explicit role claim + separate collections, not by using different secrets) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` (admin) — customer tokens default to `30d` if unset |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used once by `npm run seed:admin` to create the admin account |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` / `EMAIL_FROM` | SMTP credentials for account, join, and booking emails |
| `NOTIFY_ADMIN_ON_JOIN` | `true`/`false` — send `ADMIN_EMAIL` a notification on every new member and every new booking |
| `FRONTEND_URL` / `ADMIN_URL` | Used for CORS, and `FRONTEND_URL` also builds the password-reset link sent by email |
| `PAYMENT_GATEWAY_KEY_ID` / `PAYMENT_GATEWAY_KEY_SECRET` | Razorpay API credentials. Leave blank in development — COD keeps working, UPI/Card checkout returns a clear "not configured" message instead of crashing |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | Verifies Razorpay webhook payloads, if/when you wire one up beyond the client-side verify flow already implemented |

### `frontend/.env` and `admin/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | The backend's public API URL, e.g. `http://localhost:5000/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | **frontend only.** Powers the "Where We've Been" map on the Places page. Get one at the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis), enable "Maps JavaScript API", and restrict the key to your domain(s). Without it, the map shows a friendly "not configured" message instead of breaking. |

No secrets ever go in `frontend/.env` or `admin/.env` — only public, domain-restricted values like these.

---

## 4. Installation & Running Locally

Open three terminals (or run them one at a time).

### Backend

```bash
cd backend
cp .env.example .env      # then fill in real values
npm install
npm run seed:admin        # creates the admin account from ADMIN_EMAIL/ADMIN_PASSWORD
npm run seed:demo         # OPTIONAL — adds a few demo places/founders/reels so the site isn't empty
npm run dev                # starts on http://localhost:5000
```

### Frontend (public site)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5173
```

### Admin dashboard

```bash
cd admin
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5174
```

Log in to the admin at `http://localhost:5174/admin/login` with the `ADMIN_EMAIL` /
`ADMIN_PASSWORD` you set in `backend/.env`.

---

## 5. MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) (or run `mongod` locally).
2. Create a database user and allow your IP (or `0.0.0.0/0` for quick testing).
3. Copy the connection string into `backend/.env` as `MONGODB_URI`.

## 6. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy **Cloud Name**, **API Key**, and **API Secret** into `backend/.env`.
3. Uploads are organized automatically under `travel-community/places`,
   `travel-community/founders`, `travel-community/reels`, `travel-community/youtube`,
   `travel-community/stories`.

## 7. Google Maps Setup

The "Where We've Been" map on the public Places page uses the Google Maps
JavaScript API to plot every place that has coordinates set in the admin.

1. Create/select a project at the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis).
2. Enable the **Maps JavaScript API** for that project.
3. Create an API key, then **restrict it** to your site's domain(s) (and
   `localhost` for development) so it can't be used elsewhere.
4. Copy the key into `frontend/.env` as `VITE_GOOGLE_MAPS_API_KEY`.
5. In the admin, add a Latitude/Longitude to each place (Basic Information
   section of the place editor) — only places with coordinates appear on the map.

Without a key configured, the map section shows a friendly "not configured"
message instead of a blank or broken box — nothing else on the site depends on it.

## 8. Payment Gateway Setup (Razorpay)

UPI and Card checkout use [Razorpay](https://razorpay.com). **Cash on Delivery
needs none of this** and works immediately — use it to test the entire
booking flow (seats, emails, admin visibility) before setting up real payments.

1. Create a Razorpay account and switch to **Test Mode** first.
2. Grab your Test **Key ID** and **Key Secret** from
   [Dashboard → API Keys](https://dashboard.razorpay.com/app/keys).
3. Add them to `backend/.env` as `PAYMENT_GATEWAY_KEY_ID` / `PAYMENT_GATEWAY_KEY_SECRET`.
4. Restart the backend — no other code changes are needed. UPI/Card options
   in the booking flow will now open a real (test-mode) Razorpay checkout.
5. When ready for production, switch to your Live keys in the Razorpay
   dashboard and swap them into `backend/.env`.

The `PAYMENT_GATEWAY_WEBHOOK_SECRET` is only needed if you add a Razorpay
webhook endpoint later for extra reliability (e.g. catching payments that
succeeded but whose browser callback never fired) — the implemented flow
already verifies every payment server-side via the checkout callback, so
this isn't required to go live.

**Never** put `PAYMENT_GATEWAY_KEY_SECRET` anywhere in `frontend/.env` — only
the Key **ID** (not the secret) is ever sent to the browser, and only at the
moment a booking's checkout opens.

## 9. Email Setup

1. Use any SMTP-capable email account. For Gmail: enable 2FA, then generate an
   [App Password](https://myaccount.google.com/apppasswords).
2. Set `EMAIL_USER` to your address and `EMAIL_PASS` to the app password.
3. Without this configured, member signups still work — the welcome email is just skipped (logged to the console).

## 10. Admin Setup

`npm run seed:admin` (from `backend/`) creates or updates the single admin account
from `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`. The password
is hashed before it's ever stored — re-run this script any time to reset it.

---

## 11. Production Build

```bash
cd frontend && npm run build     # outputs to frontend/dist
cd admin && npm run build        # outputs to admin/dist
cd backend && npm start          # runs server.js directly (no build step needed)
```

## 12. Deployment Notes

- **backend**: deploy anywhere that runs Node (Render, Railway, Fly.io, a VPS...).
  Set all `backend/.env` variables as real environment variables on the host.
- **frontend** / **admin**: deploy the built `dist/` folders to any static host
  (Vercel, Netlify, Cloudflare Pages...). Set `VITE_API_URL` to your deployed
  backend's URL at build time.
- Update `FRONTEND_URL` and `ADMIN_URL` in the backend's environment to your real
  deployed URLs so CORS allows them.

## 13. Troubleshooting

| Symptom | Likely cause |
|---|---|
| Backend crashes on start with a Mongo error | `MONGODB_URI` is missing/wrong in `backend/.env` |
| Admin login fails with "Invalid email or password" | Run `npm run seed:admin` first, or the password was changed |
| Image uploads fail | Cloudinary credentials missing/wrong in `backend/.env` |
| Public site shows "No places have been added yet." | Nothing published yet — add content via the admin, or run `npm run seed:demo` |
| Admin bounces back to `/admin/login` immediately after logging in | `VITE_API_URL` in `admin/.env` doesn't point at a running backend |
| CORS errors in the browser console | `FRONTEND_URL` / `ADMIN_URL` in `backend/.env` don't match the ports you're actually running on |
| "Online payments aren't configured yet" when booking | Expected until `PAYMENT_GATEWAY_KEY_ID`/`SECRET` are set — use COD to test the flow, or add real (test-mode) Razorpay keys |
| Booking stuck at `PENDING` after paying via UPI/Card | The Razorpay checkout callback didn't reach `/api/bookings/:id/verify` (e.g. the tab was closed) — the seats are already held; check the booking in `/admin/bookings` |
| "An account already exists with this email" on Join | Someone already registered with that email — use Sign In instead (this is by design, not a bug) |
| Password reset link says invalid/expired | Reset tokens expire after 1 hour and are single-use — request a new one from `/forgot-password` |
| Customer gets logged out immediately after signing in | `customer_token` in browser storage may be stale from a previous backend/JWT_SECRET — clear site data and sign in again |

---

## 14. Project Notes

- This project (`xcape.fomo`) started life as a TanStack Start + TypeScript
  frontend prototype built with Lovable. This build is a from-scratch, plain
  JavaScript re-implementation across three separate apps, using that prototype's
  design language (dark, cinematic, editorial) as a visual reference — per the
  build brief, it does not reuse its code or TypeScript.
- The Media Library reads directly from Cloudinary rather than keeping a separate
  database table of uploads, so it can never drift out of sync with what's
  actually stored.
- Image reordering in the admin uses up/down controls rather than drag-and-drop —
  functionally equivalent, with no extra dependency.
- Deleting a Trip does **not** cascade-delete its Bookings — booking records
  (with a snapshot of the customer's name/email/phone and the price paid) are
  preserved for historical/financial records, per the "don't blindly delete
  related data" requirement. The trade-off: a deleted trip's destination/dates
  won't display on old booking detail pages (the `trip` reference is gone,
  though `pricePerSeat`/`totalAmount`/`customerSnapshot` on the booking itself
  are unaffected). If this matters for your use case, consider archiving
  trips (an `unpublished` + hidden status) instead of hard-deleting ones with
  existing bookings.
