import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  { title: "Infinity-Edge Pool", image: "/media/facilities/infinity-pool-night.jpg", span: "lg:col-span-7", ratio: "aspect-[16/10]" },
  { title: "Fitness Center", image: "/media/facilities/fitness-center.jpg", span: "lg:col-span-5", ratio: "aspect-[16/10]" },
  { title: "Deep Soaking Bathtub", image: "/media/rooms/room-bathtub.jpg", span: "lg:col-span-5", ratio: "aspect-[4/5]" },
  { title: "Lobby & Lounge", image: "/media/facilities/lobby.jpg", span: "lg:col-span-7", ratio: "aspect-[4/5]" },
];

export function ExperienceEditorial() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="The Experience"
            title="A quiet, considered atmosphere"
            description="From the courtyard pool to the marble-floored lobby, every space at Siam Tharadol is designed for a slower, more comfortable pace."
          />
          <Link
            href="/experience"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep hover:text-gold"
          >
            See the experience <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className={item.span}>
              <div className={`group relative overflow-hidden rounded-sm ${item.ratio}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 font-display text-lg text-white">{item.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
