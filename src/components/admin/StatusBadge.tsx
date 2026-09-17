const styles: Record<string, string> = {
  PAID: "bg-pine/10 text-pine",
  PENDING_PAYMENT: "bg-gold/10 text-gold-deep",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-ink/10 text-ink-soft",
  EXPIRED: "bg-ink/10 text-ink-soft",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
