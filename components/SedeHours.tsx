import { contactHoursParts, formatContactHours } from "@/content/site";

function displayHour(clock: string) {
  const [hour, minutes] = clock.split(":");
  return minutes === "00" ? String(Number(hour)) : `${Number(hour)}:${minutes}`;
}

export function SedeHours({ hours }: { hours: string }) {
  const parts = contactHoursParts(hours);

  if (!parts) {
    return (
      <p className="mt-3 text-lg font-bold text-brand-navy">
        {formatContactHours(hours)}
      </p>
    );
  }

  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-2 text-brand-navy">
      <span className="text-sm font-medium text-fg-muted">de</span>
      <time dateTime={parts.from} className="text-2xl font-bold tabular-nums tracking-tight">
        {displayHour(parts.from)}
      </time>
      <span className="text-sm font-medium text-fg-muted">a</span>
      <time dateTime={parts.to} className="text-2xl font-bold tabular-nums tracking-tight">
        {displayHour(parts.to)}
      </time>
      <span className="text-sm font-medium text-fg-muted">hs</span>
    </p>
  );
}
