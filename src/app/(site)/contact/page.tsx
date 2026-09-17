import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { hotel } from "@/content/hotel";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { FacebookIcon, InstagramIcon, LinkedinIcon, PinterestIcon, TwitterIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Siam Tharadol Hotel — ${hotel.address.full}. Call ${hotel.phone.primaryDisplay} or email ${hotel.email}.`,
};

const socials = [
  { href: hotel.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: hotel.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: hotel.social.twitter, label: "Twitter", Icon: TwitterIcon },
  { href: hotel.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: hotel.social.pinterest, label: "Pinterest", Icon: PinterestIcon },
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in Touch" description="Questions about pricing, current offers, or arrangements we can help with? Call, email, or send a message below." image="/media/facilities/lobby.jpg" />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-display text-2xl text-ink">Siam Tharadol</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-ink-soft">{hotel.address.full}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-ink-soft">
                  {hotel.phone.primaryDisplay} or {hotel.phone.secondaryDisplay}
                  <br />
                  Mobile: {hotel.phone.mobileDisplay}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
                <a href={`mailto:${hotel.email}`} className="text-ink-soft hover:text-gold-deep">
                  {hotel.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink-soft">LINE: {hotel.lineId}</p>

            <div className="mt-8 flex gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-gold hover:text-gold-deep">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>
    </>
  );
}
