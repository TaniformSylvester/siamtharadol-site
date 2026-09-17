import Image from "next/image";
import { awards } from "@/content/awards";
import { Container } from "@/components/ui/Container";

export function AwardsStrip() {
  return (
    <section className="border-b border-line bg-paper py-10 sm:py-12">
      <Container>
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-soft/70">
          Recognized By
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {awards.map((award) => (
            <div key={award.name} className="relative h-16 w-16 shrink-0 opacity-90 sm:h-20 sm:w-20">
              <Image src={award.image} alt={award.alt} fill sizes="80px" className="object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
