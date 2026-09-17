import Image from "next/image";
import Link from "next/link";
import { dining } from "@/content/dining";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function DiningTeaser() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <Image
        src={dining.heroImage}
        alt="HOM Restaurant dining room"
        fill
        sizes="100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />

      <Container className="relative">
        <div className="max-w-xl">
          <Reveal>
            <SectionHeading eyebrow="Dining" title={dining.name} description={dining.description} light />
          </Reveal>
          <Reveal delay={120} className="mt-8 flex flex-wrap gap-4">
            <Button href="/dining" variant="primary">
              Explore Dining
            </Button>
            <Button href="/contact" variant="outline-light">
              Reserve a Table
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
