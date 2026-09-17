import type { Metadata } from "next";
import Image from "next/image";
import { Bus, MapPin, Train } from "lucide-react";
import { hotel } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Location",
  description: `Siam Tharadol Hotel is located at ${hotel.address.full}, with a free shuttle to BTS Bang Chak station.`,
};

export default function LocationPage() {
  const mapQuery = encodeURIComponent(hotel.address.full);

  return (
    <>
      <PageHero
        eyebrow="Location"
        title="Find Us"
        description={hotel.address.full}
        image="/media/location/shuttle-bus.jpg"
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="font-display text-2xl text-ink">Getting Here</h2>
            <ul className="mt-6 space-y-6">
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Address</p>
                  <p className="text-sm text-ink-soft">{hotel.address.full}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <Train size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{hotel.transportation.train}</p>
                  <p className="text-sm text-ink-soft">{hotel.transportation.shuttle}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <Bus size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{hotel.transportation.bus}</p>
                  <p className="text-sm text-ink-soft">Nearby coach connections across Thailand.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 relative aspect-[4/3] overflow-hidden rounded-sm shadow-soft">
              <Image src="/media/location/shuttle-bus.jpg" alt="Siam Tharadol hotel shuttle" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
            </div>
          </Reveal>

          <Reveal delay={100} className="h-[420px] overflow-hidden rounded-sm border border-line shadow-soft lg:h-full">
            <iframe
              title="Siam Tharadol Hotel location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
