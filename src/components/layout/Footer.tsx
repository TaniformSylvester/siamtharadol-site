import Image from "next/image";
import Link from "next/link";
import { hotel } from "@/content/hotel";
import { navLinks } from "@/content/nav";
import { awards } from "@/content/awards";
import { Container } from "@/components/ui/Container";
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";

const socialLinks = [
  { href: hotel.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: hotel.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: hotel.social.twitter, label: "Twitter", Icon: TwitterIcon },
  { href: hotel.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export function Footer() {
  return (
    <footer className="bg-pine text-white/80">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/media/brand/logo.png" alt="Siam Tharadol" width={40} height={25} className="h-10 w-auto brightness-0 invert" />
          <p className="mt-5 font-display text-lg text-white">Siam Tharadol Hotel</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">{hotel.address.full}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="transition hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">Contact</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={`tel:${hotel.phone.primary}`} className="transition hover:text-white">
                {hotel.phone.primaryDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${hotel.email}`} className="transition hover:text-white">
                {hotel.email}
              </a>
            </li>
            <li>LINE: {hotel.lineId}</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">Reserve</p>
          <Link
            href="/book"
            className="mt-5 inline-flex rounded-sm bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-gold-soft"
          >
            Book Your Stay
          </Link>
          <div className="mt-6 flex gap-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-white/70 transition hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            {awards.map((award) => (
              <div key={award.name} className="relative h-11 w-11 shrink-0 rounded-sm bg-white/95 p-1">
                <Image src={award.image} alt={award.alt} fill sizes="44px" className="object-contain p-0.5" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Siam Tharadol Hotel. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies" className="hover:text-white">
              Policies
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
