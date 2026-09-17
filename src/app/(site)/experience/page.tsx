import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "The Experience",
  description: "A quiet, considered atmosphere at Siam Tharadol Hotel — the pool, lobby, rooms, and dining spaces that define a stay.",
};

const moments = [
  { title: "Infinity-Edge Pool", body: "Swim against a picturesque backdrop, lit for a calm evening dip.", image: "/media/facilities/infinity-pool-night.jpg" },
  { title: "Lobby & Lounge", body: "Marble floors, a crystal chandelier, and an informally elegant welcome.", image: "/media/facilities/lobby.jpg" },
  { title: "Fitness Center", body: "A fully equipped gym, open to all guests for a wellness journey mid-stay.", image: "/media/facilities/fitness-center.jpg" },
  { title: "In-Room Comfort", body: "Deep soaking bathtubs and calm, contemporary Thai interiors throughout.", image: "/media/rooms/room-bathtub.jpg" },
  { title: "HOM Restaurant", body: "650m² of hand-crafted décor for modern Thai dining, day or night.", image: "/media/dining/restaurant-dining-room.jpg" },
  { title: "Poolside by Day", body: "A quieter, daylight view of the courtyard pool.", image: "/media/facilities/pool-daytime.jpg" },
];

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="The Experience"
        title="A Quiet, Considered Atmosphere"
        description="From the courtyard pool to the marble-floored lobby, every space at Siam Tharadol is designed for a slower, more comfortable pace."
        image="/media/facilities/lobby.jpg"
      />

      <section className="py-20 sm:py-28">
        <Container className="space-y-20 sm:space-y-28">
          {moments.map((m, i) => (
            <Reveal key={m.title} className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lift">
                <Image src={m.image} alt={m.title} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
              </div>
              <div>
                <h2 className="font-display text-3xl text-ink">{m.title}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>
    </>
  );
}
