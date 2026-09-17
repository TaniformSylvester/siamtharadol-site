import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatThb } from "@/lib/utils";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Rooms</h1>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-gold-deep"
        >
          <Plus size={14} /> New Room
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper shadow-soft">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-[0.1em] text-ink-soft">
              <th className="px-5 py-3">Room</th>
              <th className="px-5 py-3">Bed Type</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">Capacity</th>
              <th className="px-5 py-3">Base Rate</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{r.name}</td>
                <td className="px-5 py-3">{r.bedType}</td>
                <td className="px-5 py-3">{r.sizeSqm} m²</td>
                <td className="px-5 py-3">
                  {r.capacityAdults} adults, {r.capacityChildren} children
                </td>
                <td className="px-5 py-3">
                  {formatThb(r.basePriceThb)}
                  {r.isPlaceholder && <span className="ml-1.5 text-[10px] uppercase tracking-wide text-gold-deep">indicative</span>}
                </td>
                <td className="px-5 py-3">
                  <span className={r.status === "ACTIVE" ? "text-pine" : "text-ink-soft"}>{r.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/rooms/${r.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-gold-deep hover:text-gold"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
