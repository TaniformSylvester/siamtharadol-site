"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "", company: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-pine/30 bg-pine/5 p-6 text-sm text-pine">
        Thank you — your message has been sent. We'll be in touch shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot field — hidden from real visitors via CSS, catches naive bots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.company}
        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
      </div>
      <Field label="Subject" value={form.subject} onChange={(v) => setForm((f) => ({ ...f, subject: v }))} required />
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">Message</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
        />
      </label>

      {status === "error" && (
        <p className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Something went wrong. Please try again, or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-sm bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gold-deep disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
      />
    </label>
  );
}
