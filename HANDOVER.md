# Handover — Siam Tharadol Hotel rebuild

Written 2026-09-19 for whichever Claude instance/account picks this project up next. Read this
first, then the other docs it points to. Nothing here duplicates them on purpose — this is the
"what's actually true right now, and what to ask the user before touching" layer.

## Who this is for / context

This is a **freelance client project** — the developer (the person you'll be talking to) is
rebuilding siamtharadol.com for a hotel client, not building for themselves. The client has not
seen the live booking/payment/admin internals — they were sent a comparison PDF and a Netlify
preview link. Keep that framing: recommendations should assume "ship something a paying hotel
client can trust," not "ship a demo."

## Current state (as of commit `af41a04`)

- **Live preview:** https://siamtharadol.netlify.app — auto-deploys from `master` on push via
  Netlify's GitHub integration (no CLI/token wired up; deploys are triggered by `git push` or
  manually from the Netlify dashboard).
- **Repo:** https://github.com/TaniformSylvester/siamtharadol-site.git — single `master` branch,
  clean tree, 6 commits, no open PRs.
- **Git identity already configured in this checkout:** `Siam Tharadol Dev
  <kledkaew101@gmail.com>`. Commit messages in this repo end with a
  `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer — match that convention
  (swap the model name if you're a different one) unless the user says otherwise.
- **Database:** Neon Postgres. **Local dev and the live Netlify site currently point at the same
  Neon database** — there is no separate dev/prod split yet (flagged to the user more than once,
  not yet acted on). This means: local `npm run db:seed` reseeds, local test bookings appear in
  the live admin dashboard, and deleting/editing data locally affects production. Be careful —
  see the "Shared database" gotcha below before running anything destructive.
- **Email:** Resend, account `kledkaew101` (created 2026-09-18). `RESEND_API_KEY`, `EMAIL_FROM`,
  and `NEXT_PUBLIC_SITE_URL` are set in Netlify's environment variables (the API key is marked
  "secret" there — not readable from the Netlify UI/API, only usable by server code). Locally,
  `.env` has `RESEND_API_KEY=""`, so local dev just logs "would send email" instead of sending —
  that's intentional, not broken.
- **2C2P payment gateway:** still sandbox-only. No real merchant account exists. Code is written
  against 2C2P's real v4.3 JWT API (researched from official docs, not guessed) but has never
  been run against a live account.
- **No dev server is currently running.** The last background dev-server task in this session
  exited (not a crash — it was just stopped/superseded). Start a fresh one if you need it:
  `npm run dev` (already aliased to `next dev --webpack` — **do not drop `--webpack`**, see
  gotchas).

## Read next, in this order

1. [`README.md`](README.md) — setup, admin dashboard, 2C2P config, testing the booking flow,
   "what's left before production-ready."
2. [`ARCHITECTURE.md`](ARCHITECTURE.md) — data model, double-booking prevention, payment
   architecture.
3. [`CONTENT-NEEDED.md`](CONTENT-NEEDED.md) — every fact (prices, policies, hours, distances)
   that's a placeholder because the hotel never published it. **Do not invent numbers to fill
   these** — that's a hard rule the user has repeated throughout this project. Flag gaps instead.
4. [`DEPLOYMENT.md`](DEPLOYMENT.md) — **partially stale.** Its opening section ("Locally this
   project uses SQLite... swap to Postgres") describes a migration that's already done — the
   project has been on Postgres/Neon since commit `327baca`. The Netlify env-var table and
   "before this goes to real production" section are still accurate. Worth a cleanup pass, just
   don't trust the SQLite framing at the top.

## Credentials — do NOT put these in any committed file

This doc intentionally does not contain secrets, even though it's easier for you. If you need
one, ask the user directly in chat:

- `DATABASE_URL` (Neon) — lives in local `.env` (gitignored) and Netlify's env vars.
- `RESEND_API_KEY` — only in Netlify (marked secret, not readable back out) and whatever the
  user has saved from account creation. Regenerate from resend.com if lost.
- **Live admin login** (`/admin` on the Netlify site) — the password shown to the user during
  the Netlify deploy setup is **different** from the one baked into local `.env`
  (`.env`'s hash decodes to `changeme123`, explicitly marked local-dev-only in a comment right
  above it). Don't assume the local password works on the live site, and don't try to derive or
  reset the live one yourself — ask the user.
- 2C2P sandbox/merchant credentials — don't exist yet; this is blocked on the user registering
  with 2C2P as a business, not a code task.

## Gotchas that will cost you time if you don't know them

- **`--webpack` is load-bearing, not optional.** This Windows machine's Application Control
  policy blocks Turbopack/native SWC binaries. `dev` and `build` scripts already pass
  `--webpack` — if you ever see a mysterious native-binary crash, check whether that flag got
  dropped.
- **Prisma is pinned to 6.19.3, not 7.x.** Prisma 7 requires driver adapters and dropped the
  classic `url = env("DATABASE_URL")` datasource syntax this project uses. Don't let a routine
  `npm update` bump it.
- **bcrypt hashes can't go in `.env` raw.** A raw hash like `$2b$10$...` gets mangled by Next's
  env-file variable-expansion. Store bcrypt hashes base64-encoded
  (`ADMIN_PASSWORD_HASH_B64`), decoded at read time in `src/lib/auth.ts`.
- **Shared database.** See "Current state" above. Before deleting any booking row directly
  (rather than through the app's cancel flow), confirm its status is already `CANCELLED` —
  otherwise you'll leak held inventory the way I did once earlier in this project (caught and
  fixed then, but easy to repeat).
- **Marking a Netlify env var "secret" hides it from build-time static generation.**
  `DATABASE_URL` is deliberately *not* marked secret because `/sitemap.xml` needs to read it
  during prerendering — marking it secret previously broke that build. `RESEND_API_KEY` *is*
  marked secret because it's only ever read inside API routes at request time, never at build
  time. If you add a new env var, think about which bucket it falls into before checking that
  box.
- **Booking references exclude `0/O/1/I/L`** as of commit `af41a04` — I misread a live reference
  during testing (`ST-E1560I0O` read as `...I00`) and fixed the generator's alphabet plus
  normalized guest-typed lookups to trim+uppercase. If you're debugging a "guest can't find
  their booking" report, check whether it predates this fix (old-style references can still
  contain the ambiguous characters).
- **`next dev`'s console.error interception is broken in this environment** — raw `Error` objects
  crash the dev overlay. Use `logError()` from `src/lib/log.ts` (stringifies before logging)
  instead of `console.error(someError)`.

## Open question from the user, not yet answered

The user's last question before this handover was whether the booking flow should support:
- **"Reserve now, pay at check-in"** (extend/remove the current 15-minute payment hold, no
  online charge), and/or
- **"Deposit now, balance before check-in"** (partial payment now, schedule/collect the rest
  later).

Neither exists today — `Booking`/`Payment` only support one full charge, and the hold
(`HOLD_MINUTES = 15` in `src/lib/booking.ts`) auto-releases inventory if payment isn't completed
in that window. I asked the user to clarify which model (or something else, like just a longer
hold with no payment split) they actually want, since the two options have very different
scope — **that clarification hadn't come back yet when this handover was written.** Don't start
building either without confirming which one first.

## Testing conventions used so far

No automated test suite exists — verification has been manual, via the sandbox payment simulator
(`PAYMENT_SANDBOX_MODE=true`, see README "Testing the booking flow locally") and, for live-site
changes, real bookings run through https://siamtharadol.netlify.app with cleanup afterward
(cancel through the real flow, then delete only rows already `CANCELLED`). Continue that pattern
unless you're setting up real automated tests, which nothing currently blocks you from adding.
