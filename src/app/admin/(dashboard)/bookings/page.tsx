import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatThb, formatDateDisplay } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

const STATUSES = ["ALL", "PENDING_PAYMENT", "PAID", "FAILED", "CANCELLED", "EXPIRED"] as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const activeStatus = status && STATUSES.includes(status as (typeof STATUSES)[number]) ? status : "ALL";

  const bookings = await prisma.booking.findMany({
    where: {
      ...(activeStatus !== "ALL" ? { status: activeStatus as never } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q } },
              { guestName: { contains: q } },
              { guestEmail: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { room: true },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Bookings</h1>

      <form className="mt-6 flex flex-wrap items-center gap-3" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search reference, name, or email"
          className="w-full max-w-xs rounded-sm border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
        <select name="status" defaultValue={activeStatus} className="rounded-sm border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-gold">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All statuses" : s.replace("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-sm bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-gold-deep">
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper shadow-soft">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Guest</th>
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0 hover:bg-ivory">
                <td className="px-5 py-3">
                  <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs text-gold-deep hover:underline">
                    {b.reference}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <p>{b.guestName}</p>
                  <p className="text-xs text-ink-soft">{b.guestEmail}</p>
                </td>
                <td className="px-5 py-3">{b.room.name}</td>
                <td className="px-5 py-3 text-xs">
                  {formatDateDisplay(b.checkIn)} – {formatDateDisplay(b.checkOut)}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-5 py-3 text-right">{formatThb(b.totalThb)}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-soft">
                  No bookings match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
