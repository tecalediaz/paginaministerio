import Link from "next/link";

type Crumb = { href?: string; label: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-fg-muted">
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <Link className="hover:text-fg" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-fg">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
