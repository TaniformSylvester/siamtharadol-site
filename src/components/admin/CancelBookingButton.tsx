"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export function CancelBookingButton({ bookingId, wasPaid }: { bookingId: string; wasPaid: boolean }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const confirmMessage = wasPaid
      ? "Cancel this booking? It was marked PAID — cancelling releases the room but does NOT refund the guest. Handle any refund separately."
      : "Cancel this booking? The room will be released back to availability immediately.";
    if (!window.confirm(confirmMessage)) return;

    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not cancel booking.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel booking.");
      setCancelling(false);
    }
  }

  return (
    <div className="rounded-sm border border-red-200 bg-red-50/50 p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Cancel Booking</h3>
      <p className="mt-2 text-sm text-ink-soft">
        For guest-requested cancellations (e.g. a phone call). This releases the room back to
        availability immediately.
        {wasPaid && " This booking was paid — cancelling does not process a refund; handle that separately."}
      </p>
      <button
        type="button"
        onClick={handleCancel}
        disabled={cancelling}
        className="mt-4 inline-flex items-center gap-1.5 rounded-sm border border-red-300 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100 disabled:opacity-60"
      >
        <XCircle size={14} /> {cancelling ? "Cancelling…" : "Cancel Booking"}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
