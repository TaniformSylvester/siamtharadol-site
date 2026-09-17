# Siam Tharadol Hotel — Existing Site Audit

Audited: 2026-09-17
Source: https://siamtharadol.com/ (live, read-only — never modified)

## Platform

- WordPress + WooCommerce (robots.txt disallows `/wp-content/uploads/woocommerce_*`, `/wp-admin/`)
- Yoast SEO plugin active (robots.txt has a Yoast block, sitemap at `/sitemap_index.xml`)
- Third-party hotel booking-engine widget, triggered via query string: `?be-booking-open=true` and `?be-booking-open=true&room-type=<id>`. This is an embedded widget/iframe, not a page — we could not inspect its internals from outside. Room-type IDs observed: `5032749` (Premier King), `5032750` (Premier Twin).
- Footer credit: "Design by Taniformconnect"
- Theme uses a pink/coral accent (#ec4c6b-ish) on white/charcoal — generic WP hotel template look, exactly what this rebuild should move away from while keeping the *information* accurate.

## Sitemap / existing indexed URLs

| URL | Purpose | Notes |
|---|---|---|
| `/` | Home | Hero, booking widget, intro, amenities teaser, gallery carousel, location teaser, reviews, final CTA |
| `/about-us-2/` | About | Mostly generic template boilerplate ("Who We Are", "Our Vision", "Our Mission") + a stat counter block stuck at 0 (`Apartments Sold 0+`, `Satisfied Guests 0+`, `Houses Rented 0+` — copy-pasted from a rental-property template, not hotel-appropriate, never filled in) |
| `/rooms-2/` | Room list | Only 4 room names + "BOOK" buttons. No descriptions, sizes, occupancy, beds, or prices published anywhere on the public site. |
| `/amenities/` | Amenities/Facilities | Pool, gym, rooms, bathtub, restaurant, shuttle bus, food. Contains leftover Latin filler text under "Amenities" heading ("Cursus tempus, tincidunt quis sem sapien id non eget sed in consequat tellus phasellus orci in semper elit porttitor eget metus.") — never replaced with real copy. |
| `/resto/` | Restaurant | Real, detailed content: full menu with dish names + ingredients, "650m²" space, phone-only reservations, 3 testimonials (Emma Odinson, Dian Annakin, Kyle Smith) |
| `/contact/` | Contact | Full address, phones, mobile, email, LINE ID, social links, transportation info, contact form |

Preserve these six paths in the rebuild's routing/redirect plan — see [SEO-MIGRATION.md](SEO-MIGRATION.md).

## Verified hotel information (safe to reuse)

**Name:** Siam Tharadol Hotel
**Positioning (from title tag):** "Best Boutique Hotel in Bangkok"
**Address:** 50 Sukhumvit 97/1, Phrakhanong, Bangkok 10260
**Phone:** (02) 331-3738 or (02) 331-3739 (also written +66 (0) 2331-3738)
**Mobile:** (082) 197-5212
**Email:** rsvn.siamtharadol@gmail.com
**LINE ID:** @siamtharadol
**Social:**
- Instagram: https://www.instagram.com/siamtharadol.hotel
- Facebook: https://www.facebook.com/SiamTharadol
- Twitter/X: https://twitter.com/SiamTharadol
- LinkedIn: https://www.linkedin.com/in/siam-tharadol-hotel-040280238/
- Pinterest: https://www.pinterest.com/Siamtharadolhotel/

**Room types (names only, confirmed):**
1. Premier King
2. Premier Twin
3. Premier Connected (King/Twin)
4. Two Bedroom Suite

No sizes, bed counts beyond the name, occupancy, or prices are published — see [CONTENT-NEEDED.md](CONTENT-NEEDED.md).

**Amenities (confirmed real, not invented):**
- Infinity-edge pool
- Fitness center / gym
- Deep soaking bathtub (in-room)
- In-house restaurant, multi-cuisine
- Free hotel shuttle bus to BTS Bang Chak station
- International chefs / "delicious food"

**Dining ("HOM" restaurant, from `/resto/`):**
- Modern Thai cuisine, "blended cultural theme"
- ~650m² of space, described as hand-crafted décor
- Sample menu items (real, scraped verbatim): Caesar Salad; Baguette sandwich w/ scrambled egg & bacon; Chicken with rice; Thai Basil Stir-fried Crispy Chicken; Stir-Fried Chicken Noodles; Stir-Fried Morning Glory; Chicken/Pork Noodles (Tom Yum & regular); Papaya Salad (Som Tam); Chicken baguette + fries; Dried green curry scrambled egg on rice; Stir-fried chicken with ginger; Noodles topped with minced chicken; Fried cabbage with fish sauce; Siam Fried Chicken
- Reservations: phone only, no online reservation system
- 3 real guest testimonials for the restaurant (Emma Odinson, Dian Annakin, Kyle Smith)

**Guest reviews (homepage, real, reused verbatim):**
- Thomas Angela — 4.5/5
- Julie Robinson — 4.5/5
- Morgan Johnson — 4.5/5
- James Brook — 4.5/5

**Transportation:**
- Free shuttle: hotel ↔ BTS Bang Chak station
- Nearby bus station: Eastern Bus Terminal, Ekkamai
- On-site badge: "SHA Plus+" (Thailand's health & safety accreditation program) shown on homepage hero

**Location context mentioned (unverified distances):** BTS Bang Chak station, BITEC Bangna, Jim Thompson (exact distances/times not published — do not invent; see CONTENT-NEEDED.md)

## Explicitly NOT reused

- The "Apartments Sold / Houses Rented" stat block — wrong industry, template leftover, not hotel content.
- The Latin filler paragraph on `/amenities/`.
- Star ratings — none published on the live site or supplied by the hotel; none invented.
  (Real booking-platform awards *were* later supplied directly as image files — see
  "Awards & recognition" below — which supersedes the live-site audit on this point.)
- Room sizes, prices, bed configuration, max occupancy — never published; flagged as placeholders.

## Media cross-check

Live site images (`wp-content/uploads/.../*.jpg`) matched local `/media` filenames 1:1 in content (e.g. `swimming-pool.jpg`, gym/pool/restaurant/room shots), confirming the local media folder is the hotel's actual, current photography set. All 19 original local files were inspected; all are usable, professionally shot, high resolution (2560×1707 for most full-size shots) except six that are pre-cropped smaller web exports (593–1567px wide) — still sharp enough for card/thumbnail use. None were discarded. Full inventory and reuse mapping is in [ARCHITECTURE.md](ARCHITECTURE.md#media-inventory--reuse-map).

## Awards & recognition (supplied 2026-09-17, after the initial audit)

Three real, verifiable trust badges were added to `/media` directly by the hotel and are now used on the site (previously this document said none existed — that was only true of what the *live WordPress site* published; these are real award-platform graphics, not invented):

- **Booking.com Traveller Review Awards 2024** — "Siam Tharadol SHA Extra Plus", 8.2 / 10 (`booking-com-award-2024.png`)
- **Agoda 2024 Customer Review Award** — "Siam Tharadol", 8.5 (`agoda-award-2024.png`)
- **SHA Plus+** — Amazing Thailand Safety & Health Administration certification (`sha-plus-certification.png`), matching the badge shown on the old site's homepage hero

These are rendered as-is (they're pre-designed award graphics, not data we compute), in `src/content/awards.ts` / `src/components/home/AwardsStrip.tsx`, shown on the homepage and in the footer.

Three real dish/drink photos (circular-cropped, transparent background) were supplied at the same time and are now used on `/dining`: a chicken baguette + fries, Papaya Salad (Som Tam — matches the existing menu text exactly), and a mocktail. A promotional video (`Siam-Tharadol-Video.mp4`, 1280×720, 2m13s, ~32MB) was also supplied — see CONTENT-NEEDED.md for how it was trimmed and compressed into the homepage hero background.
