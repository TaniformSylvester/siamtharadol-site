import Image from "next/image";
import { Train, Bus, MapPin } from "lucide-react";
import { hotel } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const points = [
  { icon: Train, label: hotel.transportation.train, note: "Free hotel shuttle both ways" },
  { icon: Bus, label: hotel.transportation.bus, note: "Nearby coach connections" },
  { icon: MapPin, label: "Sukhumvit, Phrakhanong", note: hotel.address.full },
];

export function LocationTeaser() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionHeading eyebrow="Location" title="Sukhumvit, with Bangkok close at hand" description="Siam Tharadol sits on Sukhumvit 97/1 in Phrakhanong, with a free hotel shuttle to BTS Bang Chak station for easy access across the city." />
          <ul className="mt-8 space-y-5">
            {points.map(({ icon: Icon, label, note }) => (
              <li key={label} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-deep">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-sm text-ink-soft">{note}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button href="/location" variant="ghost" className="mt-8">
            View Location
          </Button>
        </Reveal>

        <Reveal delay={120} className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-lift">
          <Image
            src="/media/location/shuttle-bus.jpg"
            alt="Siam Tharadol hotel shuttle bus"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </Reveal>
      </Container>
    </section>
  );
}
