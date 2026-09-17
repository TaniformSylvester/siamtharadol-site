import { Star } from "lucide-react";
import { reviews } from "@/content/reviews";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Reviews() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container>
        <Reveal align="center">
          <SectionHeading eyebrow="Guest Reviews" title="What our guests say" align="center" className="mx-auto" />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 90} className="flex flex-col rounded-sm border border-line bg-ivory p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill={idx < Math.round(review.rating) ? "currentColor" : "none"} strokeWidth={1.5} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink">{review.name}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
