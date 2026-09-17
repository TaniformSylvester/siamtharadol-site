import { CheckCircle2 } from "lucide-react";
import { whyStay } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function WhyStay() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal align="center">
          <SectionHeading eyebrow="Why Siam Tharadol" title="Made for a comfortable Bangkok stay" align="center" className="mx-auto" />
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyStay.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="text-center sm:text-left">
              <CheckCircle2 className="mx-auto text-gold sm:mx-0" size={22} />
              <h3 className="mt-4 font-display text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
