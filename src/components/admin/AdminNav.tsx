"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/rooms", label: "Rooms" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg text-ink">Siam Tharadol Admin</span>
          <nav className="hidden gap-6 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.14em] transition",
                  pathname === l.href ? "text-gold-deep" : "text-ink-soft hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-ink-soft sm:inline">{email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
      <nav className="flex gap-6 overflow-x-auto border-t border-line px-6 py-3 sm:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn("shrink-0 text-xs font-semibold uppercase tracking-[0.14em]", pathname === l.href ? "text-gold-deep" : "text-ink-soft")}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
