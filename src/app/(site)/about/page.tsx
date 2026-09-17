import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "About Us",
  description: "Siam Tharadol Hotel is devoted to creating enduring relationships with guests through personalized service and gracious hospitality.",
};

const sections = [
  {
    title: "Who We Are",
    body: "We exercise good judgment and act to create unique, memorable, and personalized experiences for our guests. We own and resolve guest problems brought to our attention, and we consistently anticipate — and are responsive to — the expressed and unexpressed wishes and needs of our guests.",
  },
  {
    title: "Our Vision",
    body: "Siam Tharadol Hotel, with its unique sense of history and place, is devoted to creating enduring relationships with our guests and members by providing highly personalized service and gracious hospitality in an informally elegant atmosphere. Our greatest asset, and the key to our success, is our people.",
  },
  {
    title: "Our Mission",
    body: "Pursuing this mission is a dedicated team of talented individuals. Knowledge and passion for exceptional, personalized service are the foundation upon which our experience is built — because satisfying our guests depends on the united efforts of many, we are most effective when we work together, respecting each other's contributions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Siam Tharadol Hotel"
        description="An informally elegant boutique hotel in the heart of Bangkok."
        image="/media/facilities/lobby.jpg"
      />

      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-3xl space-y-16">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <h2 className="font-display text-2xl text-ink">{s.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{s.body}</p>
            </Reveal>
          ))}
        </Container>
      </section>
    </>
  );
}
