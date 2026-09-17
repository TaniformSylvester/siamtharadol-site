import { hotel } from "@/content/hotel";
import { BookingSearchWidget } from "@/components/booking/BookingSearchWidget";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
      <HeroSlideshow />
      {/* Flat dimming layer, independent of any one slide's brightness, plus a vertical
          gradient for extra depth behind the text/booking widget at the bottom. */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 sm:px-8 sm:pb-16 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-soft">
          {hotel.positioning}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] text-white sm:text-6xl lg:text-7xl">
          {hotel.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          {hotel.address.full} — an infinity-edge pool, in-house Thai dining, and a free shuttle to BTS Bang Chak.
        </p>

        <div className="mt-8 max-w-3xl sm:mt-10">
          <BookingSearchWidget variant="overlay" />
        </div>
      </div>
    </section>
  );
}
