"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { formatDateDisplay, formatThb } from "@/lib/utils";

type BookingData = {
  reference: string;
  status: "PENDING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED";
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomName: string;
  subtotalThb: number;
  taxThb: number;
  totalThb: number;
  currency: string;
};

export function ConfirmationStatus({ reference }: { reference: string }) {
  const [data, setData] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const attempts = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/bookings/${reference}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Booking not found.");
        const json: BookingData = await res.json();
        if (cancelled) return;
        setData(json);

        attempts.current += 1;
        if (json.status === "PENDING_PAYMENT" && attempts.current < 15) {
          timer = setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) setError("Could not load this booking.");
      }
    }
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference]);

  if (error) {
    return <p className="rounded-sm border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</p>;
  }

  if (!data) {
    return (
      <div className="flex items-center gap-3 text-ink-soft">
        <Loader2 className="animate-spin" size={18} /> Loading booking…
      </div>
    );
  }

  if (data.status === "PENDING_PAYMENT") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-line bg-paper p-10 text-center shadow-soft">
        <Loader2 className="animate-spin text-gold" size={32} />
        <p className="font-display text-xl text-ink">Verifying your payment…</p>
        <p className="max-w-sm text-sm text-ink-soft">
          We're confirming your payment with the gateway. This usually takes a few seconds — this page will
          update automatically.
        </p>
      </div>
    );
  }

  if (data.status === "FAILED" || data.status === "CANCELLED" || data.status === "EXPIRED") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-red-200 bg-red-50 p-10 text-center">
        <XCircle className="text-red-500" size={32} />
        <p className="font-display text-xl text-ink">
          {data.status === "CANCELLED" ? "Payment Cancelled" : data.status === "EXPIRED" ? "Booking Hold Expired" : "Payment Failed"}
        </p>
        <p className="max-w-sm text-sm text-ink-soft">
          Your room was not booked and no payment was taken. Please search again to try another date or room.
        </p>
        <Link href="/book" className="mt-2 rounded-sm bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white">
          Search Again
        </Link>
      </div>
    );
  }

  // PAID
  return (
    <div id="confirmation-print" className="rounded-sm border border-line bg-paper p-8 shadow-soft sm:p-10">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="text-pine" size={36} />
        <h1 className="mt-4 font-display text-2xl text-ink sm:text-3xl">Booking Confirmed</h1>
        <p className="mt-2 text-sm text-ink-soft">A confirmation has been sent to {data.guestEmail}.</p>
      </div>

      <div className="mt-8 grid gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
        <Field label="Booking Reference" value={data.reference} mono />
        <Field label="Guest" value={data.guestName} />
        <Field label="Room" value={data.roomName} />
        <Field label="Guests" value={`${data.adults} adult${data.adults > 1 ? "s" : ""}${data.children ? `, ${data.children} child${data.children > 1 ? "ren" : ""}` : ""}`} />
        <Field label="Check-in" value={formatDateDisplay(data.checkIn)} />
        <Field label="Check-out" value={formatDateDisplay(data.checkOut)} />
      </div>

      <div className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal</span>
          <span>{formatThb(data.subtotalThb)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Tax</span>
          <span>{formatThb(data.taxThb)}</span>
        </div>
        <div className="flex justify-between pt-2 text-base font-semibold text-ink">
          <span>Total Paid</span>
          <span className="font-display">{formatThb(data.totalThb)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-sm bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-gold-deep"
        >
          Download / Print Confirmation
        </button>
        <Link
          href="/"
          className="rounded-sm border border-line px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:bg-ink/5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">{label}</p>
      <p className={`mt-1 text-sm text-ink ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
