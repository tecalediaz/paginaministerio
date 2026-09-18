import Link from "next/link";
import { site } from "@/content/site";

const sloganTone = {
  alimentacion: "green",
  territorio: "blue",
  trabajo: "red",
  infancias: "yellow",
} as const satisfies Record<(typeof site.slogan)[number]["need"], string>;

export function SloganStrip() {
  return (
    <section className="border-b border-line">
      <div className="slogan-strip flex overflow-x-auto">
        {site.slogan.map((item) => (
          <Link
            key={item.text}
            href={`/tramites?need=${item.need}`}
            data-tone={sloganTone[item.need]}
            className="slogan-strip__item flex min-h-14 min-w-[44%] flex-1 items-center justify-center border-r border-white/20 px-4 text-sm font-black tracking-[0.18em] sm:min-w-0 sm:text-base"
          >
            {item.text}
          </Link>
        ))}
      </div>
    </section>
  );
}
