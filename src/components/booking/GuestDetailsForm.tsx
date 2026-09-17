"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatThb } from "@/lib/utils";

type Props = {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  nights: number;
  subtotalThb: number;
  taxThb: number;
  totalThb: number;
};

export function GuestDetailsForm(props: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ guestName: "", guestEmail: "", guestPhone: "", specialRequests: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: props.roomId,
          checkIn: props.checkIn,
          checkOut: props.checkOut,
          adults: props.adults,
          children: props.children,
          ...form,
        }),
      });
      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.error ?? "Could not create booking.");
      }

      const paymentRes = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: bookingData.reference }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.error ?? "Could not start payment.");
      }

      router.push(paymentData.redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="font-display text-xl text-ink">Guest Details</h2>
          <p className="mt-1 text-sm text-ink-soft">We'll use these details to confirm your reservation.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Full Name"
            required
            value={form.guestName}
            onChange={(v) => setForm((f) => ({ ...f, guestName: v }))}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={form.guestEmail}
            onChange={(v) => setForm((f) => ({ ...f, guestEmail: v }))}
          />
          <TextField
            label="Phone"
            type="tel"
            required
            value={form.guestPhone}
            onChange={(v) => setForm((f) => ({ ...f, guestPhone: v }))}
          />
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Special Requests <span className="normal-case font-normal text-ink-soft/70">(optional)</span>
          </span>
          <textarea
            value={form.specialRequests}
            onChange={(e) => setForm((f) => ({ ...f, specialRequests: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
          />
        </label>

        {error && <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-gold py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {submitting ? "Processing…" : "Continue to Payment"}
        </button>
      </form>

      <aside className="h-fit rounded-sm border border-line bg-paper p-6 shadow-soft">
        <h3 className="font-display text-lg text-ink">Your Stay</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Room" value={props.roomName} />
          <Row label="Check-in" value={props.checkIn} />
          <Row label="Check-out" value={props.checkOut} />
          <Row label="Guests" value={`${props.adults} adult${props.adults > 1 ? "s" : ""}${props.children ? `, ${props.children} child${props.children > 1 ? "ren" : ""}` : ""}`} />
          <Row label="Nights" value={String(props.nights)} />
        </dl>
        <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <Row label="Subtotal" value={formatThb(props.subtotalThb)} />
          <Row label="Tax" value={formatThb(props.taxThb)} />
          <div className="flex items-center justify-between pt-2 text-base font-semibold text-ink">
            <span>Total</span>
            <span className="font-display">{formatThb(props.totalThb)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
      />
    </label>
  );
}
