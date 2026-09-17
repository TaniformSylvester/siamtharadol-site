import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
}) {
  return (
    <section className="relative flex h-[52vh] min-h-[380px] items-end overflow-hidden bg-ink">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35" />
      <Container className="relative pb-14 pt-32">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">{eyebrow}</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{description}</p>}
      </Container>
    </section>
  );
}
