import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-20">
      <p className="kicker">Error 404</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">
        Esa página no está
      </h1>
      <p className="mt-4 max-w-xl text-fg-muted">
        El trámite o el área que buscás no existe o cambió de dirección.
      </p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-bold text-accent-warm">
        Volver al inicio
      </Link>
    </div>
  );
}
