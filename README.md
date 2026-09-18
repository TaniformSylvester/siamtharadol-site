# Siam Tharadol Hotel — Website & Booking Platform

A from-scratch rebuild of siamtharadol.com: a boutique-hotel marketing site plus a working
booking, payment-architecture, and admin backend. See [ARCHITECTURE.md](ARCHITECTURE.md) for
the technical reasoning, [AUDIT.md](AUDIT.md) for what was preserved from the live site,
[CONTENT-NEEDED.md](CONTENT-NEEDED.md) for what the hotel still needs to supply, and
[SEO-MIGRATION.md](SEO-MIGRATION.md) for the URL migration plan.

## Requirements

- Node.js 20+ (tested on Node 24)
- npm

No separate database server is required — local development uses SQLite (a file on disk).

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in real values for anything you're changing (the defaults work for local
development as-is, including a sandbox admin login and payment simulator).

```bash
npm run db:migrate   # creates prisma/dev.db and applies the schema
npm run db:seed       # seeds the 4 room types + 365 days of demo availability
npm run dev            # starts the dev server at http://localhost:3000
```

Default admin login (local dev only — see "Admin dashboard" below):
`admin@siamtharadol.com` / `changeme123`

### Why `--webpack`

`npm run dev` / `npm run build` pass `--webpack` explicitly. Next 16 defaults to Turbopack,
which needs a native binary; on a machine where that binary is blocked (e.g. by an Application
Control / WDAC policy — common on locked-down Windows machines), Next silently falls back to a
slower WASM build for `dev` but **hard-fails `build`**. Webpack sidesteps this entirely. If your
machine doesn't have that restriction, you can drop `--webpack` and use Turbopack instead.

## Environment variables

See `.env.example` for the full list with comments. Highlights:

- `DATABASE_URL` — SQLite by default (`file:./dev.db`). For production, point this at a
  Postgres instance instead (see ARCHITECTURE.md).
- `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH_B64` — admin dashboard login. The hash is
  **base64-encoded** because a raw bcrypt hash contains `$`-sequences that Next's env loader
  tries to expand as variable references, silently corrupting it. Generate a new one with:
  ```bash
  node -e "console.log(Buffer.from(require('bcryptjs').hashSync('your-password', 10)).toString('base64'))"
  ```
- `PAYMENT_SANDBOX_MODE` — enables the built-in payment simulator (`/book/pay`,
  `/api/payments/simulate`) so the booking flow can be tested without a real 2C2P account.
  **Must be `false` before any real deployment.**
- `TWOC2P_*` — 2C2P payment gateway config. Sandbox placeholders are filled in for local
  testing; see "2C2P configuration" below before going live.

## Database

Prisma + SQLite locally. Useful commands:

```bash
npm run db:migrate   # apply schema changes (creates a new migration)
npm run db:seed       # re-seed rooms + availability (safe to re-run, upserts)
npm run db:studio     # opens Prisma Studio — a GUI for browsing/editing every table
```

`prisma/schema.prisma` is the source of truth for the data model (hotels, rooms, availability,
bookings, payments, admin users). See ARCHITECTURE.md for the schema and the double-booking
prevention strategy.

To move to Postgres for production: change `provider = "sqlite"` to `provider = "postgresql"`
in `prisma/schema.prisma`, point `DATABASE_URL` at your Postgres instance, then run
`npm run db:migrate` against it.

## Admin dashboard

`/admin` — staff-only, gated by a signed session cookie (see `src/lib/auth.ts`). Covers:
today's overview (arrivals, departures, occupancy, pending payments, revenue), a searchable
bookings list, booking detail with payment-transaction history and a **Cancel Booking** action
(for phone-in cancellation requests — releases inventory immediately, does not process a
refund), and room editing.

**Editing rooms** (`/admin/rooms` → Edit): name, descriptions, bed type, size, capacity, base
rate, the "indicative rate" badge, active/hidden status, the feature-bullet list, and gallery
images (picked from the hotel's existing organized photography — see "Media" in
ARCHITECTURE.md; there's no upload pipeline yet, so new photos need to be added to
`public/media` and `src/content/mediaLibrary.ts` by a developer first). Saving:

- Updates the room immediately on the live site (the public pages read the database directly,
  not the old `src/content/rooms.ts` seed file — see the note at the top of that file).
- If the base rate changed, recalculates every **future** night's price (weekend uplift
  included) — nights that are in the past or already part of a booking are never touched.
- Never resets `availableQty` on existing nights, so editing a room can't undo real
  bookings' inventory holds.

**Creating rooms** (`/admin/rooms` → New Room): same form as editing. A unique URL slug is
generated from the name automatically, and 365 days of availability are seeded at the chosen
base rate the moment you save.

**Deleting rooms** (bottom of the Edit screen, "Danger Zone"): only allowed when a room has
**zero bookings** of any status — even old cancelled/expired ones. A room with any booking
history can't be deleted (the delete button doesn't even render); set Status to Hidden instead
to pull it off the site while keeping the booking records intact. Deleting a clean room also
removes its gallery images and availability rows (cascade, enforced at the database level).

`src/content/rooms.ts` + `npm run db:seed` still exists as the initial-data path for a fresh
database, but day-to-day room management (create, edit, delete) should go through
`/admin/rooms`. For genuinely ad-hoc DB surgery (e.g. adjusting one date's availability count),
`npm run db:studio` is still available.

## 2C2P configuration

The payment code (`src/lib/payments/2c2p.ts`, `src/app/api/payments/*`) implements 2C2P's real
Payment Gateway v4.3 "Payment Token" API — a JWT-based flow (HS256, signed with your merchant
secret), confirmed against the [official docs](https://developer.2c2p.com/docs/api-payment-token)
on 2026-09-17. It has **never been run against an actual 2C2P account**, because none exists for
this project yet. Steps to go live:

1. **Register as a 2C2P merchant** (a business process with 2C2P, not a code step — needs
   company registration docs and a bank account). Ask 2C2P for sandbox credentials first.
2. **Re-check the docs at integration time** — 2C2P versions/fields can change, and the exact
   shape of the webhook notification (which field is the transaction ID, the full list of
   `respCode` values) hasn't been tested against a real account. `src/lib/payments/2c2p.ts` and
   `src/lib/payments/confirm.ts` both have comments marking what to verify.
3. Set real `TWOC2P_MERCHANT_ID` / `TWOC2P_SECRET` / `TWOC2P_API_URL` (sandbox first:
   `https://sandbox-pgw.2c2p.com`, then production: `https://pgw.2c2p.com`) in your hosting
   provider's environment variables — never in a committed file.
4. **Test thoroughly in 2C2P's own sandbox** (a real 2C2P environment with test cards — separate
   from this project's `/book/pay` simulator, which only exercises the surrounding booking logic)
   before requesting production activation from 2C2P.
5. Set `PAYMENT_SANDBOX_MODE=false` — this disables `/book/pay`'s simulator and
   `/api/payments/simulate`, which must not be reachable once real payments are possible.
6. Point `TWOC2P_RETURN_URL` / `TWOC2P_BACKEND_URL` at your real production domain.

**A booking is only ever marked `PAID` by `/api/payments/webhook`**, after verifying the JWT
signature came from 2C2P. The browser-facing return URL never confirms payment on its own — see
ARCHITECTURE.md's "Payment architecture" section for the full flow and why.

## Testing the booking flow locally

With `PAYMENT_SANDBOX_MODE=true` (the default), you can run the entire flow without any real
payment credentials:

1. Go to `/book`, search a date range.
2. Select a room, fill in guest details, continue.
3. You'll land on `/book/pay/[reference]` — a clearly-labeled sandbox screen with three
   buttons: **Simulate Successful Payment**, **Simulate Failed Payment**, **Cancel Payment**.
4. Each one exercises the real confirmation path (`src/lib/payments/confirm.ts`) exactly as a
   real 2C2P webhook would, including releasing held room inventory back on failure/cancel.
5. You'll land on `/book/confirmation/[reference]`, which polls until the booking settles.

## Production build

```bash
npm run build
npm run start
```

## Deployment

This is a standard Next.js app and deploys anywhere Next.js does (Vercel, a Node server behind
Nginx, Docker, etc.). Before deploying:

- Swap SQLite for Postgres (see "Database" above).
- Fill in real `TWOC2P_*` values and set `PAYMENT_SANDBOX_MODE=false`.
- Set a strong, random `ADMIN_SESSION_SECRET`.
- Review [CONTENT-NEEDED.md](CONTENT-NEEDED.md) — several room details (size, price, occupancy)
  are placeholders pending real figures from the hotel.

## What's left before this is production-ready

- **Real hotel data**: room sizes/prices/occupancy, cancellation policy, check-in/out times —
  none of these were published on the old site (see CONTENT-NEEDED.md). The booking flow works
  correctly but with placeholder rates.
- **Real 2C2P integration**: current code is sandbox-shaped, not connected to a live account
  (see "2C2P configuration" above).
- **Transactional email**: booking confirmation and cancellation emails are wired up via
  [Resend](https://resend.com) (see `src/lib/email/`), but with no `RESEND_API_KEY` set they
  just log server-side instead of sending — same for the contact form. Set `RESEND_API_KEY` and
  `EMAIL_FROM` (a verified sending domain) locally and in your host's environment variables to
  make them real.
- **Cancellation/refund policy**: guests can self-cancel a `PENDING_PAYMENT` or `PAID` booking
  from `/book/manage` (reference + email lookup), and staff can cancel on a guest's behalf from
  `/admin/bookings/[id]`. Both release the held room nights immediately and send a cancellation
  email. Neither processes an actual refund or enforces day-based eligibility — the hotel has
  never published a cancellation policy (see CONTENT-NEEDED.md), so refunds for already-paid
  bookings stay a manual follow-up step. Once the hotel gives real policy terms, add the
  eligibility check inside `cancelBooking()` in `src/lib/booking.ts`.
- **Room image uploads**: `/admin/rooms` picks images from a fixed list of already-organized
  photos (`src/content/mediaLibrary.ts`) — there's no upload-a-new-photo pipeline yet. Adding
  new photography still means dropping a file in `public/media` and adding it to that list.
- **Analytics**: Google Analytics / Search Console are not wired up — add tracking IDs via
  environment variables when the hotel provides them, and wire up the event names listed in
  the original brief (`view_room`, `check_availability`, `begin_payment`, etc.).
- **A production Postgres database** — SQLite is for local development only.
