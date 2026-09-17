import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.28em]",
            light ? "text-gold-soft" : "text-gold-deep"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={cn("font-display text-3xl leading-tight sm:text-4xl", light ? "text-white" : "text-ink")}>
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/75" : "text-ink-soft")}>
          {description}
        </p>
      )}
    </div>
  );
}
