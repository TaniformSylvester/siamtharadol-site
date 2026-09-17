# Architecture

## Stack decision

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), TypeScript | Server components for fast, SEO-friendly marketing pages; API routes / route handlers double as the booking backend in the same deploy unit; runs on almost any Node host (Vercel, a VPS, or the shared/managed hosting a boutique hotel is likely to already have). |
| Styling | Tailwind CSS v4 | Fast to build a consistent design system with, no runtime CSS-in-JS cost, ships only the classes used. |
| Database | Prisma ORM, SQLite for local dev, Postgres-ready for production | SQLite needs zero setup (`prisma migrate dev` creates `dev.db` on disk) so the project runs on a fresh machine with one command — important for a "beginner-friendly" local workflow. The Prisma schema is portable: swapping `provider = "sqlite"` for `"postgresql"` and pointing `DATABASE_URL` at a managed Postgres instance (Supabase, Neon, RDS, DigitalOcean) is the only change needed for production. Postgres is recommended for production because of proper concurrent-write handling for availability/booking locks. |
| Payments | 2C2P (Thailand-market standard for hotels), server-side only | Matches the hotel's market (Thai baht, Thai guest base) and the user's explicit requirement. All secrets stay server-side; see [Payment architecture](#payment-architecture-2c2p). |
| Admin auth | Cookie session issued by a server route, credentials from env vars | No third-party auth dependency needed for a single-property, small-staff admin panel; upgradeable to real users/roles later without changing the surrounding architecture. |

Rejected: a static site generator (no real booking backend possible), a separate PHP/WordPress rebuild (perpetuates the template-look problem and mixes content with commerce logic), Mongo/NoSQL (booking data is inherently relational — rooms, dates, inventory counts, payments — and needs transactional integrity to prevent double-booking).

## Directory layout

```
site/
  src/
    app/                        route segments (pages + API routes)
      (site)/                   public marketing site, shares one layout
        page.tsx                 homepage
        rooms/page.tsx            room list
        rooms/[slug]/page.tsx     room detail
        dining/page.tsx
        facilities/page.tsx
        experience/page.tsx
        gallery/page.tsx
        location/page.tsx
        contact/page.tsx
        book/page.tsx             search results / availability
        book/[roomSlug]/page.tsx  guest details + review
        book/confirmation/[ref]/page.tsx
      admin/                     staff dashboard, behind session cookie
        login/page.tsx
        page.tsx                  today overview
        bookings/page.tsx
        bookings/[id]/page.tsx
        rooms/page.tsx
      api/
        availability/route.ts     GET search
        bookings/route.ts         POST create booking (PENDING)
        bookings/[ref]/route.ts   GET booking by reference
        payments/create/route.ts  POST -> 2C2P payment request
        payments/return/route.ts  GET  browser return from 2C2P (does NOT confirm payment)
        payments/webhook/route.ts POST server-to-server confirmation (the only thing that confirms payment)
        admin/login/route.ts
        admin/logout/route.ts
        sitemap.xml / robots.txt  generated via Next metadata routes
    components/                  design-system + section components
    lib/
      db.ts                      Prisma client singleton
      pricing.ts                 server-side price/tax calculation (never trust client totals)
      booking.ts                 availability + booking-hold logic
      payments/2c2p.ts           2C2P request signing / verification (sandbox-ready, real creds via env)
      auth.ts                    admin session helpers
    content/                     structured hotel content (rooms, amenities, reviews) as typed data, sourced from AUDIT.md
  prisma/
    schema.prisma
    seed.ts
  public/media/...               organized hotel photography (see below)
```

## Media inventory & reuse map

Originals live untouched in `Desktop/Siamtharadol/media/`. Copies (unmodified pixels, just organized + renamed) were placed under `site/public/media/<category>/`:

| Original filename | Dimensions | Copied to | Primary use |
|---|---|---|---|
| `logo.png` | 631×396 | `brand/logo.png` | Nav logo, favicon source |
| `front view.jpg` | 2560×1618 | `hero/exterior-facade-dusk.jpg` | Homepage hero |
| `lobby.jpg` | 2560×1707 | `facilities/lobby.jpg` | Homepage intro, Experience page |
| `bedroom.jpg` | 2560×1707 | `rooms/premier-king-bedroom.jpg` | Premier King room card + detail gallery |
| `bedtwin.jpg` | 2560×1707 | `rooms/premier-twin-bedroom.jpg` | Premier Twin room card + detail gallery |
| `twinbed.jpg` | 1567×1045 | `rooms/twin-beds-detail.jpg` | Premier Twin detail gallery |
| `bathtub.jpg` | 2560×1707 | `rooms/room-bathtub.jpg` | Room detail galleries, Facilities |
| `room.jpg` | 2560×1707 | `rooms/room-suite-view.jpg` | Two Bedroom Suite card |
| `room with work space.jpg` | 2560×1707 | `rooms/room-workspace.jpg` | Premier Connected detail gallery |
| `room with balcony.jpg` | 1170×680 | `rooms/room-balcony.jpg` | Room detail gallery |
| `room-01.jpg` | 1170×680 | `rooms/room-detail-01.jpg` | Room detail gallery |
| `minibar.jpg` | 1170×680 | `rooms/room-minibar.jpg` | Room amenities gallery |
| `soaps.jpg` | 2560×1707 | `rooms/bathroom-amenities.jpg` | Room amenities gallery |
| `Restaurant.jpg` | 2560×1707 | `dining/restaurant-dining-room.jpg` | Dining hero |
| `steak.jpg` | 698×930 | `dining/restaurant-dish-steak.jpg` | Dining menu highlight |
| `gym.jpg` | 2560×1707 | `facilities/fitness-center.jpg` | Facilities |
| `pool.jpg` | 2560×1707 | `facilities/infinity-pool-night.jpg` | Homepage, Facilities hero |
| `swimming pool.jpg` | 593×455 | `facilities/pool-daytime.jpg` | Gallery, Facilities |
| `shuttle bus.jpg` | 688×466 | `location/shuttle-bus.jpg` | Location page |

All 19 files from the original delivery are used somewhere; none were discarded as unusable. `next/image` handles responsive resizing/format negotiation (AVIF/WebP) at request time, so the large 2560px originals are safe to keep as the source — no separately-maintained "optimized copies" are needed, which also avoids ever having two diverging versions of the same photo.

### Later additions (2026-09-17): awards, dish photos

| Original filename | Copied to | Primary use |
|---|---|---|
| `Booking-Award.png` | `awards/booking-com-award-2024.png` | Homepage "Recognized By" strip, footer |
| `โลโก้-...png` (Agoda award graphic) | `awards/agoda-award-2024.png` | Homepage "Recognized By" strip, footer |
| `sha-logo.png` | `awards/sha-plus-certification.png` | Homepage "Recognized By" strip, footer |
| `10467_..._fotor....png` (chicken baguette) | `dining/dish-chicken-baguette.png` | Dining "Signature Dishes" |
| `121066_..._fotor....png` (papaya salad) | `dining/dish-papaya-salad.png` | Dining "Signature Dishes" |
| `1732024_...removebg....png` (mocktail) | `dining/drink-mocktail.png` | Dining "Mocktails & Refreshments" |

A promotional video (`Siam-Tharadol-Video.mp4`, 1280×720, 2m13s, 32MB) supplied the same day was tried as a compressed, trimmed hero background (~910KB, 8.7s loop) and worked correctly, but was replaced at the user's request with an image slideshow instead — see "Hero slideshow" below. Nothing from the video ships in `public/`; the original is untouched in the top-level `Desktop/Siamtharadol/media/` folder if it's wanted for something else later.

### Hero slideshow

`src/components/home/HeroSlideshow.tsx` (client component) cross-fades between 5 existing photos already used elsewhere on the site (exterior facade, infinity pool, lobby, a Premier King bedroom, the restaurant) on a 5.5s timer, with clickable dot indicators and a 1.5s CSS opacity transition. Auto-advance is skipped for `prefers-reduced-motion: reduce` (first slide stays static). No new media files were needed — it reuses the same organized `public/media/` assets.

## Data model

```
Hotel(id, name, description, address, phone, email)
Room(id, slug, roomType, name, description, capacityAdults, capacityChildren, bedType, sizeSqm, basePriceThb, status, sortOrder)
RoomImage(id, roomId, url, alt, sortOrder)
Availability(id, roomId, date, availableQty, priceThb)   -- unique(roomId, date)
Booking(id, reference, guestName, guestEmail, guestPhone, checkIn, checkOut, adults, children, roomId, roomQuantity, subtotalThb, taxThb, totalThb, currency, status, expiresAt, createdAt, updatedAt)
Payment(id, bookingId, provider, transactionRef, amountThb, currency, status, responseCode, rawPayload, createdAt, updatedAt)
AdminUser(id, email, passwordHash, name)
```

Indexes: `Availability(roomId, date)` unique — this is the row a booking transaction locks/decrements, which is what prevents double-booking (see below). `Booking(reference)` unique. `Booking(status, expiresAt)` for the expiry sweep.

### Preventing double-booking

A booking is created in a single database transaction that:
1. Re-reads `Availability` rows for every date in the stay, `roomId` locked for update.
2. Confirms `availableQty >= roomQuantity` for every night.
3. Decrements `availableQty` and inserts the `Booking` row with `status = PENDING_PAYMENT` and `expiresAt = now + 15 minutes`, in the same transaction.

If the payment never completes, a scheduled sweep (or a check on next availability read) releases expired `PENDING_PAYMENT` bookings back into inventory. Nothing about price or room-quantity ever comes from the client on the confirm step — `lib/pricing.ts` recomputes the total server-side from `Availability` rows before writing the `Booking`.

## Payment architecture (2C2P)

2C2P's Payment Gateway v4.3 "Payment Token" API (confirmed against the official docs at
[developer.2c2p.com](https://developer.2c2p.com/docs/api-payment-token), checked 2026-09-17) is
JWT-based end to end: both the request you send and the response/webhook 2C2P sends back are
`{ "payload": "<jwt>" }`, signed HS256 with the merchant secret key.

```
SEARCH → hold room (PENDING_PAYMENT booking + decremented availability, 15-min expiry)
  → POST /api/payments/create
      PAYMENT_SANDBOX_MODE=true (default, no real merchant account yet):
        skips 2C2P entirely, sends the guest to this project's own /book/pay simulator
      PAYMENT_SANDBOX_MODE=false (real credentials):
        signs a JWT {merchantID, invoiceNo, amount, currencyCode, backendReturnUrl,
        frontendReturnUrl}, POSTs it to {TWOC2P_API_URL}/payment/4.3/paymentToken,
        decodes the JWT response for `webPaymentUrl`, redirects the guest there
  → guest pays or cancels on 2C2P's own hosted page
  → GET /api/payments/return  (browser redirect to frontendReturnUrl)
      purely cosmetic — shows a "verifying your payment" state and polls current status;
      CRITICALLY, this handler never marks a booking PAID
  → POST /api/payments/webhook  (server-to-server call to backendReturnUrl, not the browser)
      verifies + decodes the JWT payload with the merchant secret (throws if invalid),
      treats respCode "0000" as success, anything else as failure,
      and only THIS handler is allowed to transition Payment/Booking to PAID or FAILED
```

Why the split matters: a customer can close the tab, lose connection, or the browser can fabricate a fake "success" hit on the return URL. Only the signed, server-to-server webhook is trusted to confirm money actually moved. `/api/payments/return` is purely cosmetic.

States handled: `PENDING_PAYMENT`, `PAID`, `FAILED`, `CANCELLED`, `EXPIRED` (booking hold timed out before payment). Duplicate-payment protection: `confirmPayment()` is idempotent — a Payment already resolved (not `PENDING`) is a no-op on replay.

**Not yet verified against a real 2C2P sandbox account** (none exists for this project): which exact field the webhook notification uses as its transaction identifier (`tranRef`? something else?), and the full list of `respCode` values (only "0000" = success is confirmed; there's no confirmed distinction between "failed" and "cancelled by guest" at this field). To hedge that, `confirmPayment()` looks a payment up by `transactionRef` first and falls back to matching on `invoiceNo` (= `Booking.reference`, which is always known). **Get real sandbox credentials from 2C2P and test the actual webhook payload shape before going live** — see README "2C2P configuration".

Env vars (see `.env.example`, values are placeholders only, never committed real secrets):
```
TWOC2P_MERCHANT_ID=
TWOC2P_SECRET=
TWOC2P_API_URL=
TWOC2P_RETURN_URL=
TWOC2P_BACKEND_URL=
```

## Admin dashboard

Session-cookie gated (`lib/auth.ts`), credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` env vars (bcrypt hash, never a plaintext password in env). Scope in this version: today's arrivals/departures/occupancy/pending-payments/revenue overview, booking list with search/filter, booking detail with payment status, and a read view of rooms. Editing room descriptions/gallery/pricing from the UI is left as a clearly-marked next step (see README "What's left").

## SEO

- Per-route `generateMetadata` (title, description, canonical, Open Graph, Twitter card) seeded from the real copy in `src/content/`.
- `app/sitemap.ts` and `app/robots.ts` (Next metadata routes) replace the old Yoast-generated sitemap.
- JSON-LD `Hotel`/`LodgingBusiness` schema in the root layout; `BreadcrumbList` on room/detail pages.
- Old URLs preserved or 301-redirected — see [SEO-MIGRATION.md](SEO-MIGRATION.md).
