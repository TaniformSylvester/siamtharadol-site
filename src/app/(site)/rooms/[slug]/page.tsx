import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Maximize, Users } from "lucide-react";
import { getActiveRoomBySlug, parseFeatures } from "@/lib/rooms";
import { formatThb } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Rendered on demand rather than statically generated, so an edit made in /admin/rooms shows
// up immediately without a rebuild.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = await getActiveRoomBySlug(slug);
  if (!room) return {};
  return {
    title: room.name,
    description: room.shortDescription,
    openGraph: { images: room.images[0] ? [room.images[0].url] : [] },
  };
}

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getActiveRoomBySlug(slug);
  if (!room) notFound();

  const features = parseFeatures(room.features);
  const heroImage = room.images[0]?.url ?? "/media/hero/exterior-facade-dusk.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Rooms", item: "https://siamtharadol.com/rooms" },
      { "@type": "ListItem", position: 2, name: room.name, item: `https://siamtharadol.com/rooms/${room.slug}` },
    ],
  };

  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-ink">
        <Image src={heroImage} alt={room.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <Container className="relative flex h-full flex-col justify-end pb-12">
          {room.isPlaceholder && (
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Rate & size shown are indicative — confirm at booking
            </span>
          )}
          <h1 className="font-display text-4xl text-white sm:text-5xl">{room.name}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{room.shortDescription}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl text-ink">Overview</h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{room.description}</p>

              <div className="mt-6 flex flex-wrap gap-6 border-y border-line py-6 text-sm">
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <Maximize size={16} className="text-gold" /> {room.sizeSqm} m²
                </span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <BedDouble size={16} className="text-gold" /> {room.bedType}
                </span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <Users size={16} className="text-gold" /> Up to {room.capacityAdults} adults, {room.capacityChildren} children
                </span>
              </div>
            </Reveal>

            {features.length > 0 && (
              <Reveal delay={90} className="mt-10">
                <h3 className="font-display text-xl text-ink">Room Features</h3>
                <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink-soft">
                      <Check size={15} className="shrink-0 text-gold" /> {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {room.images.length > 0 && (
              <Reveal delay={150} className="mt-10">
                <h3 className="font-display text-xl text-ink">Gallery</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {room.images.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                      <Image src={img.url} alt={img.alt} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={100} className="h-fit rounded-sm border border-line bg-paper p-6 shadow-soft lg:sticky lg:top-28">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
              From {room.isPlaceholder && "(indicative)"}
            </p>
            <p className="font-display text-3xl text-ink">
              {formatThb(room.basePriceThb)} <span className="text-sm font-sans text-ink-soft">/ night</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">Excl. tax · subject to availability</p>
            <Link
              href={`/book?room=${room.slug}`}
              className="mt-6 block w-full rounded-sm bg-gold py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep"
            >
              Check Availability
            </Link>
            <p className="mt-4 text-center text-xs text-ink-soft">
              Or call{" "}
              <a href="tel:+6623313738" className="font-medium text-gold-deep">
                (02) 331-3738
              </a>
            </p>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
