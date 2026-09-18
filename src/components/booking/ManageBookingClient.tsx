"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { formatDateDisplay, formatThb } from "@/lib/utils";
import { hotel } from "@/content/hotel";

type BookingDetails = {
  reference: string;
  status: "PENDING_PAYMENT" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED";
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  subtotalThb: number;
  taxThb: number;
  totalThb: number;
};

const CANCELLABLE_STATUSES = new Set(["PENDING_PAYMENT", "PAID"]);

export function ManageBookingClient({ initialReference }: { initialReference: string }) {
  const [reference, setReference] = useState(initialReference);
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(reference.trim())}/manage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not find that booking.");
      setBooking(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not find that booking.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!booking) return;
    if (!window.confirm("Cancel this booking? Your room will be released immediately.")) return;

    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(booking.reference)}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not cancel booking.");
      setCancelled(true);
      setBooking((b) => (b ? { ...b, status: "CANCELLED" } : b));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  if (!booking) {
    return (
      <form onSubmit={handleLookup} className="mx-auto max-w-md space-y-5 rounded-sm border border-line bg-paper p-8 shadow-soft">
        <div>
          <h2 className="font-display text-xl text-ink">Find Your Booking</h2>
          <p className="mt-1 text-sm text-ink-soft">Enter your booking reference and the email you booked with.</p>
        </div>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Booking Reference</span>
          <input
            type="text"
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="ST-XXXXXXXX"
            className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm uppercase outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          />
        </label>
        {error && <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-gold py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep disabled:opacity-60"
        >
          {loading ? "Searching…" : "Find Booking"}
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-sm border border-line bg-paper p-8 shadow-soft">
      {cancelled && (
        <div className="mb-6 flex items-center gap-2 rounded-sm border border-pine/30 bg-pine/5 p-4 text-sm text-pine">
          <CheckCircle2 size={18} /> Booking cancelled. A confirmation has been sent to {booking.guestEmail}.
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-ink-soft">{booking.reference}</p>
        <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-deep">
          {booking.status.replace("_", " ")}
        </span>
      </div>
      <h2 className="mt-1 font-display text-xl text-ink">{booking.roomName}</h2>

      <dl className="mt-5 space-y-2 text-sm">
        <Row label="Guest" value={booking.guestName} />
        <Row label="Check-in" value={formatDateDisplay(booking.checkIn)} />
        <Row label="Check-out" value={formatDateDisplay(booking.checkOut)} />
        <Row label="Guests" value={`${booking.adults} adult${booking.adults > 1 ? "s" : ""}${booking.children ? `, ${booking.children} child${booking.children > 1 ? "ren" : ""}` : ""}`} />
      </dl>

      <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        <Row label="Subtotal" value={formatThb(booking.subtotalThb)} />
        <Row label="Tax" value={formatThb(booking.taxThb)} />
        <div className="flex items-center justify-between pt-2 text-base font-semibold text-ink">
          <span>Total</span>
          <span className="font-display">{formatThb(booking.totalThb)}</span>
        </div>
      </div>

      {error && <p className="mt-5 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {CANCELLABLE_STATUSES.has(booking.status) && !cancelled && (
        <div className="mt-6 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-ink-soft">
            Our cancellation and refund policy is confirmed case by case
            {booking.status === "PAID" ? " for paid bookings" : ""} — if you cancel here and had already paid,
            our team will follow up about your refund. For anything urgent, call{" "}
            <a href={`tel:${hotel.phone.primary}`} className="font-medium text-gold-deep">
              {hotel.phone.primaryDisplay}
            </a>
            .
          </p>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-4 w-full rounded-sm border border-red-300 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-50 disabled:opacity-60"
          >
            {cancelling ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Cancelling…
              </span>
            ) : (
              "Cancel This Booking"
            )}
          </button>
        </div>
      )}

      <Link href="/" className="mt-6 block text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
        Return Home
      </Link>
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
