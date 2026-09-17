"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Ban } from "lucide-react";
import { formatThb } from "@/lib/utils";

export function PaymentSimulator({
  reference,
  transactionRef,
  totalThb,
}: {
  reference: string;
  transactionRef: string;
  totalThb: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simulate(outcome: "SUCCESS" | "FAILED" | "CANCELLED") {
    setLoading(outcome);
    setError(null);
    try {
      const res = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionRef, outcome }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Simulation failed.");
      }
      router.push(`/api/payments/return?ref=${reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(null);
    }
  }

  return (
    <div className="rounded-sm border border-line bg-paper p-8 shadow-soft">
      <div className="rounded-sm border border-gold/40 bg-gold/5 p-4 text-xs leading-relaxed text-gold-deep">
        <strong className="font-semibold">Sandbox simulation.</strong> This screen stands in for
        2C2P's hosted payment page so the booking flow can be tested end to end. No real payment
        gateway is called and no money moves.
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-line pb-4">
        <span className="text-sm text-ink-soft">Amount due</span>
        <span className="font-display text-2xl text-ink">{formatThb(totalThb)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
        <span>Booking reference</span>
        <span className="font-mono">{reference}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-ink-soft">
        <span>Transaction ref</span>
        <span className="font-mono">{transactionRef}</span>
      </div>

      {error && <p className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-3">
        <button
          onClick={() => simulate("SUCCESS")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-pine py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-pine-soft disabled:opacity-60"
        >
          <CheckCircle2 size={15} /> {loading === "SUCCESS" ? "Processing…" : "Simulate Successful Payment"}
        </button>
        <button
          onClick={() => simulate("FAILED")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-line py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:bg-ink/5 disabled:opacity-60"
        >
          <XCircle size={15} /> {loading === "FAILED" ? "Processing…" : "Simulate Failed Payment"}
        </button>
        <button
          onClick={() => simulate("CANCELLED")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-line py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft transition hover:bg-ink/5 disabled:opacity-60"
        >
          <Ban size={15} /> {loading === "CANCELLED" ? "Processing…" : "Cancel Payment"}
        </button>
      </div>
    </div>
  );
}
