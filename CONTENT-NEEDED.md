# Content the hotel needs to supply

Nothing below was invented — each item is either shown as a clearly-marked placeholder in the UI or left blank/"Contact us" until real data arrives. Do not publish this build to production before filling these in.

## Rooms — highest priority

The live site never published sizes, bed counts, occupancy, or prices for any room. Placeholder values used in this build (marked `(placeholder)` in the CMS content file `src/content/rooms.ts`) so the layouts aren't empty:

| Room | Needed | Currently shown |
|---|---|---|
| Premier King | size (sqm), max adults/children, exact bed type, base nightly rate (THB), room count in inventory | "Size and rate on request" placeholder copy + a `PLACEHOLDER` price flag that the UI visibly labels as unconfirmed |
| Premier Twin | same | same |
| Premier Connected (King/Twin) | same, plus: is this one bookable unit or two connecting rooms sold together? | same |
| Two Bedroom Suite | same | same |

**Action needed:** hotel to provide a rate sheet (even an internal one) with per-room size, bed configuration, max occupancy, and current rack rate in THB. Until then, `book/` flow uses the placeholder base rates only for demonstrating the booking UX — **do not go live with placeholder prices.**

## Photography gaps

- No image of the Premier Connected room configuration specifically (currently reuses King/Twin shots + a note that a dedicated photo is pending).
- No exterior daytime shot (only dusk/night exterior available) — fine for the moody hero, but the Location page would benefit from one daytime street-level photo showing the building entrance.
- No food photography beyond `steak.jpg` — the extensive real menu on the old `/resto/` page has no matching photos for most dishes. Menu is shown as a text list; add photos per dish if the hotel wants a more visual dining page.
- No photo of the "Two Bedroom Suite" specifically as a suite layout (living + 2 bedrooms) — currently represented by `room.jpg` which reads as a single guestroom.

## Copy / facts

- **Star rating / classification:** none published anywhere on the live site or supplied. Not shown.
- **Awards:** ~~none found~~ — resolved 2026-09-17: hotel supplied a Booking.com Traveller Review Award 2024 (8.2) and an Agoda 2024 Customer Review Award (8.5) as image files, now shown on the homepage and footer (see AUDIT.md "Awards & recognition"). If these ratings are refreshed annually, the hotel will need to supply updated badge graphics each year — the images aren't dynamically pulled from Booking.com/Agoda's APIs.
- **"SHA Plus+" badge:** confirmed still current — hotel re-supplied the badge graphic alongside the two awards above. Shown on the homepage.
- **Promotional video** (`Siam-Tharadol-Video.mp4`, ~32MB, supplied 2026-09-17): trimmed/compressed and used as the hero background (see ARCHITECTURE.md), then removed at the user's request in favor of an image slideshow — the homepage hero is now `src/components/home/HeroSlideshow.tsx`. The original file is untouched in the top-level `Desktop/Siamtharadol/media/` folder if it's wanted for something else (e.g. a dedicated "Watch a tour" page or embedded elsewhere) — most of the raw footage is documentary-style B-roll (staff facing camera, a "Leg Press" on-screen label) rather than atmospheric background, so it would need similar trimming for most reuses.
- **Exact distances/times to BTS Bang Chak, BITEC Bangna, Jim Thompson House, Sukhumvit:** old site named these places but never gave a distance or walk/drive time. Placeholder copy says "near" without inventing a number — provide actual distances or transit times.
- **Restaurant hours:** the very first homepage teaser said "Open daily at 07:00–19:00" for the in-house restaurant, but this line did not appear on the dedicated `/resto/` page and may be stale. Confirm current hours before publishing.
- **Policies:** check-in/check-out time, cancellation policy, children/extra-bed policy, pet policy — none published on the old site. Needed for the room detail pages and the booking review step.
- **Legal/registration details** for invoicing (Thai tax ID, company registration name if different from "Siam Tharadol Hotel") — needed for the 2C2P merchant setup and for tax-compliant booking receipts.

## Reviews

Only 4 homepage reviews + 3 restaurant reviews exist on the live site (7 total), all reused verbatim in this build with attribution. If the hotel has a Google/Booking.com/TripAdvisor profile with more (and higher-volume) reviews, pulling a live/verified feed from there would strengthen the Reviews section — do not fabricate additional quotes to fill space.

## Special offers / packages

Section 26 of the brief asks for offer architecture to be ready but explicitly says not to invent promotions. The data model (`Room.basePriceThb` + a future `Promotion` table) supports adding real seasonal rates or packages later; none exist yet, so the UI currently shows no offers module rather than a fake one.
