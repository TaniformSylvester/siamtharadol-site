import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Policies",
  description: "Check-in, cancellation, and stay policies at Siam Tharadol Hotel.",
};

export default function PoliciesPage() {
  return (
    <>
      <PageHero eyebrow="Information" title="Policies" image="/media/facilities/lobby.jpg" />
      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-2xl">
          <div className="rounded-sm border border-gold/30 bg-gold/5 p-6 text-sm leading-relaxed text-ink-soft">
            Check-in/check-out times, cancellation terms, and other stay policies have not yet been published by
            the hotel. Please call{" "}
            <a href="tel:+6623313738" className="font-medium text-gold-deep">
              (02) 331-3738
            </a>{" "}
            for current policy details, or see{" "}
            <span className="font-mono text-xs">CONTENT-NEEDED.md</span> in this project for what's outstanding.
          </div>
        </Container>
      </section>
    </>
  );
}
