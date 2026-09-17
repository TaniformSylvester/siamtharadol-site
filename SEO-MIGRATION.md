# SEO migration plan

Goal: none of the URLs Google currently has indexed for siamtharadol.com should 404 when this rebuild goes live.

## URL mapping

| Old URL (WordPress) | New URL (Next.js) | Change |
|---|---|---|
| `/` | `/` | same |
| `/about-us-2/` | `/about` | renamed — the old `-2` suffix is a WordPress artifact (a duplicate-slug collision), not an intentional URL; redirect old → new |
| `/rooms-2/` | `/rooms` | same reasoning — redirect |
| `/amenities/` | `/facilities` | renamed to match the brief's IA ("Facilities" in nav); redirect |
| `/resto/` | `/dining` | renamed for clarity; redirect |
| `/contact/` | `/contact` | same |
| *(new, did not exist)* | `/rooms/[slug]` | individual room pages — net-new, additive, no redirect needed |
| *(new, did not exist)* | `/experience`, `/gallery`, `/location`, `/book` | net-new sections called for in the brief |

## Redirects

Implement all six as permanent (308) redirects in `next.config.ts` so link equity and any external backlinks/bookmarks keep working:

```ts
async redirects() {
  return [
    { source: "/about-us-2", destination: "/about", permanent: true },
    { source: "/about-us-2/", destination: "/about", permanent: true },
    { source: "/rooms-2", destination: "/rooms", permanent: true },
    { source: "/rooms-2/", destination: "/rooms", permanent: true },
    { source: "/amenities", destination: "/facilities", permanent: true },
    { source: "/amenities/", destination: "/facilities", permanent: true },
    { source: "/resto", destination: "/dining", permanent: true },
    { source: "/resto/", destination: "/dining", permanent: true },
  ];
}
```
(Implemented in `next.config.ts` in this repo.)

## Sitemap / robots

- Old: Yoast-generated `sitemap_index.xml`.
- New: `src/app/sitemap.ts` (Next.js metadata route) listing every public route with `lastModified`/`changeFrequency`; served at `/sitemap.xml`.
- New: `src/app/robots.ts` allows all crawlers, points to the new sitemap, disallows `/admin` and `/api`.
- When this goes live, resubmit the new sitemap in Google Search Console and use the URL Inspection tool to request re-indexing of the six changed paths; do not delete the property, just add the new sitemap alongside monitoring the redirects.

## Metadata

Old site's titles followed the pattern `"{Page} | Siam Tharadol Hotel"` with no custom meta description on most pages (checked via `<meta name="description">` — absent on `/contact/`). New site keeps the same title pattern for continuity and adds a real, unique meta description per page (see each route's `generateMetadata`), Open Graph image, and canonical URL — closing a gap the old site had, not just preserving it.

## Structured data (net-new)

The old site had no JSON-LD. New site adds:
- `LodgingBusiness` (name, address, phone, image, priceRange once real rates exist) in the root layout, on every page.
- `BreadcrumbList` on `/rooms/[slug]` pages.
- `Menu`/`MenuItem` structured data on `/dining` once the hotel confirms current menu pricing (holding off until prices are confirmed — see CONTENT-NEEDED.md — since structured data with wrong prices is worse than none).

## What intentionally is NOT preserved

- The booking-engine query-string pattern `?be-booking-open=true&room-type=<id>` — that belonged to the old third-party widget and has no SEO value (it's not a crawlable page, just client-side widget state). The new `/book` flow uses real, crawlable-where-appropriate routes instead.
