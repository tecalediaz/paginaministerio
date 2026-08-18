import { infancias } from "@/content/infancias";

export function EventSchedule() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {infancias.events.map((event) => (
        <article
          key={event.id}
          className="grid gap-3 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
        >
          <div>
            <p className="font-display text-lg font-semibold text-bg-deep">
              {event.date}
            </p>
            <p className="mt-1 text-sm font-medium text-accent">
              {event.time} hs
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-fg-muted">{event.place}</p>
            <p className="mt-1 text-sm text-fg-muted/90">{event.audience}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
