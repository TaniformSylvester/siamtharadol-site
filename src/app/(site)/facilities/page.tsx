import type { Metadata } from "next";
import Image from "next/image";
import { facilities } from "@/content/facilities";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Facilities",
  description: "An infinity-edge pool, fitness center, in-house dining, and free hotel shuttle — the facilities at Siam Tharadol Hotel.",
};

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="Amenities & Facilities"
        description="We don't just give you a room to stay — we give you an environment to enjoy a refreshing, rejuvenating day off."
        image="/media/facilities/infinity-pool-night.jpg"
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <Reveal key={f.slug} delay={i * 90} className="group overflow-hidden rounded-sm border border-line bg-paper shadow-soft">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
