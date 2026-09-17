"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function todayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function BookingSearchWidget({ variant = "overlay" }: { variant?: "overlay" | "card" }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayIso(1));
  const [checkOut, setCheckOut] = useState(todayIso(2));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/book?${params.toString()}`);
  }

  const isOverlay = variant === "overlay";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full rounded-sm",
        isOverlay
          ? "border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-lift sm:p-5"
          : "border border-line bg-paper p-5 shadow-soft sm:p-6"
      )}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 sm:items-end">
        <Field label="Check-in" light={isOverlay}>
          <div className="relative">
            <input
              type="date"
              required
              value={checkIn}
              min={todayIso()}
              onChange={(e) => setCheckIn(e.target.value)}
              className={cn(
                "w-full appearance-none bg-transparent py-1 pr-6 text-sm font-medium outline-none",
                isOverlay ? "text-white [color-scheme:dark]" : "text-ink [color-scheme:light]"
              )}
            />
            <Calendar size={16} className={cn("pointer-events-none absolute right-0 top-1/2 -translate-y-1/2", isOverlay ? "text-white/70" : "text-ink-soft")} />
          </div>
        </Field>

        <Field label="Check-out" light={isOverlay}>
          <div className="relative">
            <input
              type="date"
              required
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className={cn(
                "w-full appearance-none bg-transparent py-1 pr-6 text-sm font-medium outline-none",
                isOverlay ? "text-white [color-scheme:dark]" : "text-ink [color-scheme:light]"
              )}
            />
            <Calendar size={16} className={cn("pointer-events-none absolute right-0 top-1/2 -translate-y-1/2", isOverlay ? "text-white/70" : "text-ink-soft")} />
          </div>
        </Field>

        <Field label="Adults" light={isOverlay}>
          <div className="relative">
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className={cn(
                "w-full appearance-none bg-transparent py-1 pr-6 text-sm font-medium outline-none",
                isOverlay ? "text-white [color-scheme:dark]" : "text-ink [color-scheme:light]"
              )}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n} className="text-ink">
                  {n} Adult{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <Users size={16} className={cn("pointer-events-none absolute right-0 top-1/2 -translate-y-1/2", isOverlay ? "text-white/70" : "text-ink-soft")} />
          </div>
        </Field>

        <Field label="Children" light={isOverlay}>
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className={cn(
              "w-full appearance-none bg-transparent py-1 text-sm font-medium outline-none",
              isOverlay ? "text-white [color-scheme:dark]" : "text-ink [color-scheme:light]"
            )}
          >
            {Array.from({ length: 5 }, (_, i) => i).map((n) => (
              <option key={n} value={n} className="text-ink">
                {n} Child{n === 1 ? "" : "ren"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error && <p className="mt-3 text-xs font-medium text-red-200">{error}</p>}

      <button
        type="submit"
        className="mt-4 w-full rounded-sm bg-gold py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-soft sm:mt-5"
      >
        Check Availability
      </button>
    </form>
  );
}

function Field({ label, light, children }: { label: string; light: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={cn("block text-[10px] font-semibold uppercase tracking-[0.16em]", light ? "text-white/60" : "text-ink-soft/80")}>
        {label}
      </span>
      <div className={cn("mt-1 border-b pb-1", light ? "border-white/25" : "border-line")}>{children}</div>
    </label>
  );
}
