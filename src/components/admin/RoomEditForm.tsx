"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { mediaLibrary } from "@/content/mediaLibrary";

export type RoomEditData = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  bedType: string;
  sizeSqm: number;
  capacityAdults: number;
  capacityChildren: number;
  basePriceThb: number;
  isPlaceholder: boolean;
  status: "ACTIVE" | "HIDDEN";
  features: string[];
  images: { url: string; alt: string }[];
};

const BLANK_ROOM: Omit<RoomEditData, "id"> = {
  name: "",
  shortDescription: "",
  description: "",
  bedType: "",
  sizeSqm: 30,
  capacityAdults: 2,
  capacityChildren: 0,
  basePriceThb: 2900,
  isPlaceholder: true,
  status: "ACTIVE",
  features: [],
  images: [],
};

export function RoomEditForm({
  room,
  bookingCount = 0,
}: {
  room?: RoomEditData;
  /** Only relevant in edit mode — how many bookings reference this room (blocks deletion). */
  bookingCount?: number;
}) {
  const mode = room ? "edit" : "create";
  const data = room ?? { id: "", ...BLANK_ROOM };
  const router = useRouter();
  const [form, setForm] = useState({
    name: data.name,
    shortDescription: data.shortDescription,
    description: data.description,
    bedType: data.bedType,
    sizeSqm: data.sizeSqm,
    capacityAdults: data.capacityAdults,
    capacityChildren: data.capacityChildren,
    basePriceThb: data.basePriceThb,
    isPlaceholder: data.isPlaceholder,
    status: data.status,
  });
  const [features, setFeatures] = useState(data.features.length > 0 ? data.features : [""]);
  const [images, setImages] = useState(data.images.length > 0 ? data.images : [{ url: mediaLibrary[0].path, alt: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function updateFeature(i: number, value: string) {
    setFeatures((f) => f.map((item, idx) => (idx === i ? value : item)));
  }
  function removeFeature(i: number) {
    setFeatures((f) => f.filter((_, idx) => idx !== i));
  }

  function updateImage(i: number, patch: Partial<{ url: string; alt: string }>) {
    setImages((imgs) => imgs.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  }
  function removeImage(i: number) {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
  }
  function moveImage(i: number, dir: -1 | 1) {
    setImages((imgs) => {
      const next = [...imgs];
      const target = i + dir;
      if (target < 0 || target >= next.length) return imgs;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const cleanFeatures = features.map((f) => f.trim()).filter(Boolean);
    const cleanImages = images.filter((img) => img.url && img.alt.trim());

    if (cleanImages.length !== images.length) {
      setError("Every image needs alt text (a short description) before saving.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(mode === "edit" ? `/api/admin/rooms/${data.id}` : "/api/admin/rooms", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, features: cleanFeatures, images: cleanImages }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not save changes.");

      if (mode === "create") {
        router.push(`/admin/rooms/${json.id}/edit`);
        router.refresh();
        return;
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (bookingCount > 0) return;
    if (!window.confirm(`Delete "${form.name}" permanently? This cannot be undone.`)) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/rooms/${data.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not delete room.");
      router.push("/admin/rooms");
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete room.");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-sm border border-line bg-paper p-6 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Basics</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <TextField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          <TextField label="Bed Type" value={form.bedType} onChange={(v) => setForm((f) => ({ ...f, bedType: v }))} required />
        </div>
        <div className="mt-5">
          <TextField
            label="Short Description (card / list teaser)"
            value={form.shortDescription}
            onChange={(v) => setForm((f) => ({ ...f, shortDescription: v }))}
            required
          />
        </div>
        <label className="mt-5 block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Full Description</span>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          />
        </label>
      </section>

      <section className="rounded-sm border border-line bg-paper p-6 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Size, Capacity & Rate</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField label="Size (m²)" value={form.sizeSqm} onChange={(v) => setForm((f) => ({ ...f, sizeSqm: v }))} />
          <NumberField label="Max Adults" value={form.capacityAdults} onChange={(v) => setForm((f) => ({ ...f, capacityAdults: v }))} />
          <NumberField label="Max Children" value={form.capacityChildren} onChange={(v) => setForm((f) => ({ ...f, capacityChildren: v }))} />
          <NumberField label="Base Rate (THB/night)" value={form.basePriceThb} onChange={(v) => setForm((f) => ({ ...f, basePriceThb: v }))} />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Changing the base rate updates every future night's price immediately (weekend uplift is reapplied automatically);
          nights already booked or in the past are never touched.
        </p>

        <div className="mt-5 flex flex-wrap gap-8">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isPlaceholder}
              onChange={(e) => setForm((f) => ({ ...f, isPlaceholder: e.target.checked }))}
              className="h-4 w-4 accent-gold"
            />
            Rate/size is indicative (show "confirm at booking" badge)
          </label>

          <label className="flex items-center gap-2 text-sm text-ink">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "ACTIVE" | "HIDDEN" }))}
              className="rounded-sm border border-line bg-white px-3 py-1.5 text-sm outline-none focus:border-gold"
            >
              <option value="ACTIVE">Active (visible on site)</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-sm border border-line bg-paper p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Features</h2>
          <button
            type="button"
            onClick={() => setFeatures((f) => [...f, ""])}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold-deep hover:text-gold"
          >
            <Plus size={14} /> Add feature
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder="e.g. Deep soaking bathtub"
                className="w-full rounded-sm border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button type="button" onClick={() => removeFeature(i)} aria-label="Remove feature" className="text-ink-soft hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {features.length === 0 && <p className="text-sm text-ink-soft">No features listed.</p>}
        </div>
      </section>

      <section className="rounded-sm border border-line bg-paper p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Gallery Images</h2>
          <button
            type="button"
            onClick={() => setImages((imgs) => [...imgs, { url: mediaLibrary[0].path, alt: "" }])}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold-deep hover:text-gold"
          >
            <Plus size={14} /> Add image
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Picked from the hotel's existing organized photography — there's no upload feature yet, see README.
        </p>

        <div className="mt-4 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="flex items-start gap-4 rounded-sm border border-line p-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-ivory">
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <select
                  value={img.url}
                  onChange={(e) => updateImage(i, { url: e.target.value })}
                  className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {mediaLibrary.map((m) => (
                    <option key={m.path} value={m.path}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={img.alt}
                  onChange={(e) => updateImage(i, { alt: e.target.value })}
                  placeholder="Alt text (required, e.g. 'Premier King bedroom')"
                  className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} aria-label="Move up" className="text-ink-soft hover:text-ink disabled:opacity-30">
                  <ArrowUp size={15} />
                </button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} aria-label="Move down" className="text-ink-soft hover:text-ink disabled:opacity-30">
                  <ArrowDown size={15} />
                </button>
                <button type="button" onClick={() => removeImage(i)} aria-label="Remove image" className="text-ink-soft hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 && <p className="text-sm text-ink-soft">No images — add at least one before saving.</p>}
        </div>
      </section>

      {error && <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-sm border border-pine/30 bg-pine/5 p-3 text-sm text-pine">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-sm bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep disabled:opacity-60"
      >
        {saving ? "Saving…" : mode === "create" ? "Create Room" : "Save Changes"}
      </button>

      {mode === "edit" && (
        <section className="rounded-sm border border-red-200 bg-red-50/50 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Danger Zone</h2>
          {bookingCount > 0 ? (
            <p className="mt-3 text-sm text-red-700">
              This room has {bookingCount} booking{bookingCount > 1 ? "s" : ""} on record, so it can't be deleted —
              set Status to Hidden above instead to remove it from the site while keeping booking history intact.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm text-ink-soft">
                Permanently delete this room and its gallery images/availability. There are no bookings against it,
                so this is safe, but it cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="mt-4 rounded-sm border border-red-300 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition hover:bg-red-100 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete Room"}
              </button>
              {deleteError && <p className="mt-3 text-sm text-red-700">{deleteError}</p>}
            </>
          )}
        </section>
      )}
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <input
        type="number"
        required
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}
