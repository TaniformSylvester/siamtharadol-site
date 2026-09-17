import Image from "next/image";
import { hotel } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <Image
        src="/media/facilities/infinity-pool-night.jpg"
        alt="Siam Tharadol infinity pool at night"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      <Container className="relative text-center">
        <Reveal align="center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Reserve Direct</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-white sm:text-5xl">
            Your Bangkok Stay Starts Here
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/75">
            Call {hotel.phone.primaryDisplay} or check availability online for the best direct rate.
          </p>
          <Button href="/book" size="lg" className="mt-8">
            Check Availability
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
