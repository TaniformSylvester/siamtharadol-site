import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RoomEditForm } from "@/components/admin/RoomEditForm";

export default function AdminNewRoomPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/rooms" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> All Rooms
      </Link>

      <h1 className="mt-4 font-display text-2xl text-ink">New Room</h1>
      <p className="mt-2 text-sm text-ink-soft">
        A URL slug and 365 days of availability are generated automatically once you save.
      </p>

      <div className="mt-8">
        <RoomEditForm />
      </div>
    </div>
  );
}
