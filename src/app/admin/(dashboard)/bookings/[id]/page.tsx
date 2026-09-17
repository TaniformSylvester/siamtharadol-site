import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDateDisplay, formatThb } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true, payments: { orderBy: { createdAt: "desc" } } },
  });
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-ink-soft">{booking.reference}</p>
          <h1 className="mt-1 font-display text-2xl text-ink">{booking.guestName}</h1>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card title="Guest">
          <Row label="Name" value={booking.guestName} />
          <Row label="Email" value={booking.guestEmail} />
          <Row label="Phone" value={booking.guestPhone} />
        </Card>
        <Card title="Stay">
          <Row label="Room" value={booking.room.name} />
          <Row label="Check-in" value={formatDateDisplay(booking.checkIn)} />
          <Row label="Check-out" value={formatDateDisplay(booking.checkOut)} />
          <Row label="Guests" value={`${booking.adults} adults, ${booking.children} children`} />
        </Card>
        <Card title="Payment">
          <Row label="Subtotal" value={formatThb(booking.subtotalThb)} />
          <Row label="Tax" value={formatThb(booking.taxThb)} />
          <Row label="Total" value={formatThb(booking.totalThb)} />
          {booking.status === "PENDING_PAYMENT" ? (
            <Row label="Hold expires" value={formatDateDisplay(booking.expiresAt)} />
          ) : (
            <Row label="Booked on" value={formatDateDisplay(booking.createdAt)} />
          )}
        </Card>
        <Card title="Special Requests">
          <p className="text-sm text-ink-soft">{booking.specialRequests || "None"}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-ink">Payment Transactions</h2>
        <div className="mt-3 overflow-x-auto rounded-sm border border-line bg-paper shadow-soft">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
                <th className="px-5 py-3">Transaction Ref</th>
                <th className="px-5 py-3">Provider</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {booking.payments.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-mono text-xs">{p.transactionRef}</td>
                  <td className="px-5 py-3">{p.provider}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-3 text-right">{formatThb(p.amountThb)}</td>
                </tr>
              ))}
              {booking.payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-ink-soft">
                    No payment attempts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-line bg-paper p-5 shadow-soft">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
