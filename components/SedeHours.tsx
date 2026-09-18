import { contactHoursParts, formatContactHours } from "@/content/site";

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
    <p className="mt-3 flex items-baseline gap-2.5 text-brand-navy">
      <time dateTime={parts.from} className="text-2xl font-bold tabular-nums tracking-tight">
        {parts.from}
      </time>
      <span className="text-sm font-medium text-fg-muted">a</span>
      <time dateTime={parts.to} className="text-2xl font-bold tabular-nums tracking-tight">
        {parts.to}
      </time>
    </p>
  );
}
