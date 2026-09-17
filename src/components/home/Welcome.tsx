import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Welcome() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="Welcome"
            title="An informally elegant stay on Sukhumvit"
            description="Siam Tharadol is devoted to creating enduring relationships with our guests through highly personalized service and gracious hospitality. Every room is finished in contemporary Thai style, framed by marble, warm lighting, and quiet, considered detail."
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-lift">
            <Image
              src="/media/facilities/lobby.jpg"
              alt="Siam Tharadol lobby with chandelier and marble floor"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
