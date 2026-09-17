import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, Maximize, Users } from "lucide-react";
import { formatThb } from "@/lib/utils";

export type RoomCardData = {
  slug: string;
  name: string;
  shortDescription: string;
  sizeSqm: number;
  bedType: string;
  capacityAdults: number;
  basePriceThb: number;
  isPlaceholder: boolean;
  images: { url: string; alt: string }[];
};

export function RoomCard({ room, priority = false }: { room: RoomCardData; priority?: boolean }) {
  const heroImage = room.images[0]?.url ?? "/media/hero/exterior-facade-dusk.jpg";

  return (
    <div className="group overflow-hidden rounded-sm border border-line bg-paper shadow-soft transition-shadow hover:shadow-lift">
      <Link href={`/rooms/${room.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={heroImage}
          alt={room.images[0]?.alt ?? room.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="p-6">
        <h3 className="font-display text-xl text-ink">
          <Link href={`/rooms/${room.slug}`} className="hover:text-gold-deep">
            {room.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{room.shortDescription}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Maximize size={13} /> {room.sizeSqm} m²
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble size={13} /> {room.bedType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} /> Up to {room.capacityAdults} adults
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
              From {room.isPlaceholder && "(indicative)"}
            </p>
            <p className="font-display text-lg text-ink">
              {formatThb(room.basePriceThb)} <span className="text-xs font-sans text-ink-soft">/ night</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/rooms/${room.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft transition hover:text-gold-deep"
            >
              View <ArrowUpRight size={13} />
            </Link>
            <Link
              href={`/book?room=${room.slug}`}
              className="rounded-sm bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gold-deep"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
