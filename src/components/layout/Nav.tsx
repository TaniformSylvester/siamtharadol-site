"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/nav";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-paper/95 shadow-soft backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/media/brand/logo.png"
            alt="Siam Tharadol"
            width={36}
            height={23}
            className={cn("h-9 w-auto transition", !solid && "brightness-0 invert")}
            priority
          />
          <span
            className={cn(
              "font-display text-lg tracking-wide transition-colors",
              solid ? "text-ink" : "text-white"
            )}
          >
            Siam Tharadol
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                solid ? "text-ink-soft hover:text-gold-deep" : "text-white/90 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/book"
            className={cn(
              "hidden rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors sm:inline-flex",
              solid ? "bg-gold text-white hover:bg-gold-deep" : "bg-white text-ink hover:bg-gold hover:text-white"
            )}
          >
            Book Now
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-sm lg:hidden",
              solid ? "text-ink" : "text-white"
            )}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 pb-8 pt-4 lg:hidden">
          <nav className="flex flex-col divide-y divide-line">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-4 text-sm font-semibold uppercase tracking-[0.18em] text-ink-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/book"
            className="mt-6 flex w-full items-center justify-center rounded-sm bg-gold px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
