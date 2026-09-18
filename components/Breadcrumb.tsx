import Link from "next/link";

type Crumb = { href?: string; label: string };

function parentHref(items: Crumb[]): string {
  if (items.length <= 1) return "/";
  const parent = items.slice(0, -1).findLast((item) => item.href);
  return parent?.href ?? "/";
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const backHref = parentHref(items);

  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-fg-muted">
      <Link
        href={backHref}
        className="inline-flex min-h-11 min-w-11 items-center font-semibold text-fg hover:text-fg sm:hidden"
      >
        Volver
      </Link>
      <ol className="hidden flex-wrap gap-x-2 gap-y-1 break-words sm:flex">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <Link
                className="inline-flex min-h-11 min-w-11 items-center hover:text-fg"
                href={item.href}
              >
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center font-semibold text-fg">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
