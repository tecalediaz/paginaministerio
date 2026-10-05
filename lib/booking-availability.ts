import type { TramiteFormField } from "./tramite-form";

/** Only future dates are offered; full dates retain a public notice and their historical label. */
export function bookingAvailability(
  slots: { id: string; date: string; capacity: number }[],
  counts: Record<string, number> | null,
  options: NonNullable<TramiteFormField["options"]>,
  now = Date.now(),
) {
  const future = slots.filter(slot => new Date(slot.date).getTime() > now);
  const available = new Set(future.filter(slot => Number(counts?.[slot.id] ?? 0) < slot.capacity).map(slot => slot.id));
  const full = new Set(future.filter(slot => Number(counts?.[slot.id] ?? 0) >= slot.capacity).map(slot => slot.id));
  return {
    options: options.filter(option => available.has(option.value)),
    fullDates: options.filter(option => full.has(option.value)).map(option => ({ id: option.value, label: option.label })),
  };
}
