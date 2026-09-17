import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const images = [
  { src: "/media/rooms/premier-king-bedroom.jpg", alt: "Premier King bedroom" },
  { src: "/media/facilities/infinity-pool-night.jpg", alt: "Infinity pool at night" },
  { src: "/media/dining/restaurant-dining-room.jpg", alt: "HOM restaurant dining room" },
  { src: "/media/rooms/room-balcony.jpg", alt: "Room balcony" },
  { src: "/media/facilities/lobby.jpg", alt: "Hotel lobby" },
  { src: "/media/rooms/room-bathtub.jpg", alt: "Deep soaking bathtub" },
];

export function GalleryTeaser() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Gallery" title="Our Inside Pictures" description="A closer look at the rooms, pool, and dining spaces at Siam Tharadol." />
          <Link
            href="/gallery"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep hover:text-gold"
          >
            View full gallery <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={i * 70}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <Link href="/gallery" className={`group relative block h-full overflow-hidden rounded-sm ${i === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-square"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
