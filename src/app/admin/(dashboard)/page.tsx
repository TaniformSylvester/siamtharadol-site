import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatThb } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

function todayRange() {
  // UTC midnight, to match how booking dates are stored (see src/lib/booking.ts).
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export default async function AdminOverviewPage() {
  const { start, end } = todayRange();

  const [arrivals, departures, paidBookings, pendingPayments, totalRooms] = await Promise.all([
    prisma.booking.count({ where: { checkIn: { gte: start, lt: end }, status: "PAID" } }),
    prisma.booking.count({ where: { checkOut: { gte: start, lt: end }, status: "PAID" } }),
    prisma.booking.findMany({
      where: { status: "PAID", checkIn: { lte: start }, checkOut: { gt: start } },
      select: { roomQuantity: true },
    }),
    prisma.booking.count({ where: { status: "PENDING_PAYMENT", expiresAt: { gt: new Date() } } }),
    prisma.room.count({ where: { status: "ACTIVE" } }),
  ]);

  const occupiedRooms = paidBookings.reduce((sum, b) => sum + b.roomQuantity, 0);

  const revenueAgg = await prisma.booking.aggregate({
    where: { status: "PAID", createdAt: { gte: start, lt: end } },
    _sum: { totalThb: true },
  });

  const stats = [
    { label: "Arrivals Today", value: arrivals },
    { label: "Departures Today", value: departures },
    { label: "Occupied Rooms Tonight", value: occupiedRooms },
    { label: "Rooms in Inventory", value: totalRooms },
    { label: "Pending Payments", value: pendingPayments },
    { label: "Revenue Today", value: formatThb(revenueAgg._sum.totalThb ?? 0) },
  ];

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { room: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Today</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-line bg-paper p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Recent Bookings</h2>
        <Link href="/admin/bookings" className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep hover:text-gold">
          View all
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-paper shadow-soft">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs text-gold-deep hover:underline">
                    {b.reference}
                  </Link>
                </td>
                <td className="px-5 py-3">{b.guestName}</td>
                <td className="px-5 py-3">{b.room.name}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-5 py-3 text-right">{formatThb(b.totalThb)}</td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-soft">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
