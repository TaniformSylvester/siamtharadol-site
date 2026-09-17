import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { dining } from "@/content/dining";
import { hotel } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/layout/PageHero";
import { MenuTabs } from "@/components/dining/MenuTabs";

export const metadata: Metadata = {
  title: "Dining",
  description: "HOM Restaurant at Siam Tharadol Hotel — modern Thai cuisine across 650m² of hand-crafted interior. Reservations by phone.",
};

export default function DiningPage() {
  return (
    <>
      <PageHero eyebrow="Dining" title={dining.name} description={dining.intro} image={dining.heroImage} />

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-ink-soft">{dining.description}</p>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {dining.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 90} className="text-center">
                <h3 className="font-display text-lg text-ink">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{h.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <Reveal align="center">
            <SectionHeading eyebrow="Signature Dishes" title="From the Kitchen" align="center" className="mx-auto" />
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {dining.featured.map((dish, i) => (
              <Reveal
                key={dish.name}
                delay={i * 100}
                className="group overflow-hidden rounded-sm border border-line bg-ivory shadow-soft"
              >
                <div className="flex items-center gap-6 p-6">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-paper shadow-soft sm:h-40 sm:w-40">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="160px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ink sm:text-xl">{dish.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-wide text-ink-soft/80">{dish.ingredients}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Menu"
              title="A Taste of Modern Thai"
              description="Sourcing ingredients from land, sea, and artisanal purveyors — each dish connects guests to nature in a relaxed, beautiful setting."
            />
            <div className="mt-8 rounded-sm border border-gold/30 bg-gold/5 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-gold-deep">
                <Phone size={15} /> {dining.reservationNote}
              </p>
              <a href={`tel:${hotel.phone.primary}`} className="mt-1 block text-sm text-ink-soft">
                {hotel.phone.primaryDisplay}
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-sm border border-line bg-paper shadow-soft">
              <div className="relative aspect-[4/3]">
                <Image src={dining.drinks.image} alt={dining.drinks.title} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-ink">{dining.drinks.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dining.drinks.description}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <MenuTabs />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal align="center">
            <SectionHeading eyebrow="Testimonials" title="What Diners Say" align="center" className="mx-auto" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {dining.testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90} className="rounded-sm border border-line bg-paper p-6">
                <p className="text-sm leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">{t.name}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image src="/media/dining/restaurant-dish-steak.jpg" alt="Signature dish at HOM Restaurant" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </section>
    </>
  );
}
