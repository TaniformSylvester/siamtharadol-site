export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatThb(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateDisplay(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const ms = outD.getTime() - inD.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}
