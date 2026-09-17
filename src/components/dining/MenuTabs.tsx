"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { dining } from "@/content/dining";

export function MenuTabs() {
  const [active, setActive] = useState(0);
  const category = dining.menu[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {dining.menu.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition",
              active === i ? "border-gold bg-gold text-white" : "border-line text-ink-soft hover:border-gold/50"
            )}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {category.items.map((item) => (
          <li key={item.name} className="border-b border-line pb-4">
            <p className="text-sm font-semibold text-ink">{item.name}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft/80">{item.ingredients}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
