# Deploying to Netlify (for client review)

## The one thing that has to change first: the database

Locally this project uses SQLite — a file on disk, zero setup. **That does not work on
Netlify** (or any serverless host). Netlify Functions run on ephemeral, short-lived containers
with no persistent local disk — a SQLite file written during one request is not guaranteed to
exist for the next one. This isn't a config tweak; it's swapping to a real hosted database
before anything else here matters.

**Recommended: [Neon](https://neon.tech)** — serverless Postgres, generous free tier, works
well with Prisma, and gives you a connection string in under a minute. Supabase is a fine
alternative if you'd rather have that ecosystem.

1. Create a free Neon project. Copy its connection string (`postgresql://...`).
2. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in your local `.env` to the Neon connection string temporarily, then run:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
   This creates the schema and seeds the 4 rooms + a year of availability directly on Neon.
4. Set `DATABASE_URL` (the same Neon string) as an environment variable in Netlify — see below.

You only do this once. After that, both your local dev environment and Netlify can point at the
same Neon database if you want (fine for a client-preview phase), or you can run a second Neon
project for local dev vs. production later.

## Netlify setup

1. Push this repo to GitHub (Netlify deploys from git).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs` (also pinned in
   `netlify.toml` in this repo) — no manual build configuration needed beyond environment
   variables.
4. Under **Site configuration → Environment variables**, add everything from `.env.example`
   with real values:

   | Variable | Value for a client-preview deploy |
   |---|---|
   | `DATABASE_URL` | your Neon connection string |
   | `PAYMENT_SANDBOX_MODE` | `true` — lets your client test the full booking flow without a real 2C2P account |
   | `ADMIN_EMAIL` | whatever you want the client (or you) to log in with |
   | `ADMIN_PASSWORD_HASH_B64` | generate fresh, don't reuse the one in this repo's `.env.example` — see README "Environment variables" |
   | `ADMIN_SESSION_SECRET` | a long random string (e.g. `openssl rand -hex 32`) |
   | `TWOC2P_MERCHANT_ID`, `TWOC2P_SECRET` | leave as placeholders until a real 2C2P account exists |
   | `TWOC2P_API_URL` | `https://sandbox-pgw.2c2p.com` |
   | `TWOC2P_RETURN_URL` | `https://<your-netlify-site>.netlify.app/api/payments/return` |
   | `TWOC2P_BACKEND_URL` | `https://<your-netlify-site>.netlify.app/api/payments/webhook` |

5. Deploy. Netlify gives you a `*.netlify.app` URL immediately — that's what you send your client.
6. Log into `/admin` with the credentials you set above and confirm the dashboard loads (proves
   the database connection works end to end).

## What to check after the first deploy

- Home page loads with real images (confirms `public/media` shipped correctly).
- `/book` → search → select a room → guest details → payment simulator → confirmation, start to
  finish (confirms the database and booking transaction logic work on Netlify's Functions, not
  just locally).
- `/admin` login, bookings list, and editing a room's price (confirms writes work, not just reads).
- `/sitemap.xml` and `/robots.txt` resolve.

## Before this goes from "client preview" to real production

This deployment guide gets you a working, shareable preview — it is **not** yet safe to take
real payments or real guest bookings from it. Before that:

- Get a real 2C2P merchant account and flip `PAYMENT_SANDBOX_MODE=false` (see README "2C2P
  configuration") — while sandbox mode is on, anyone who finds `/api/payments/simulate` could
  mark a booking as paid without paying, which is fine for a demo, not for production.
- Confirm the room prices in CONTENT-NEEDED.md are real, hotel-approved rates, not placeholders.
- Point a real custom domain at the Netlify site instead of the `*.netlify.app` one.
- Set up a second, separate Neon database for production vs. whatever you used for preview, so
  test bookings from the demo phase don't show up in the client's real admin dashboard.
