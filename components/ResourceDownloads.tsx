import type { Tramite } from "@/lib/tramite";

export function ResourceDownloads({ documents }: { documents: NonNullable<Tramite["documents"]> }) {
  return <div className="mt-8">
    <h2 className="text-xl font-black text-brand-navy">Documentos para descargar</h2>
    <div className={`mt-4 grid gap-4 ${documents.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {documents.map((document, index) => <div key={`${document.url}-${index}`} className="flex min-w-0 flex-col gap-4 border border-line bg-white p-5">
        <div className="min-w-0"><h3 className="break-words font-bold text-brand-navy">{document.title}</h3>
          {document.mimeType ? <p className="mt-2 text-sm text-fg-muted">{document.mimeType === "application/pdf" ? "PDF" : document.mimeType === "image/png" ? "PNG" : "JPG"}{document.size ? ` · ${(document.size / 1024 / 1024).toFixed(1)} MB` : ""}</p> : null}
        </div>
        <a href={document.url} download className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-accent px-4 font-bold text-white hover:bg-accent-warm" aria-label={`Descargar ${document.title}`}><span aria-hidden="true">↓</span> Descargar</a>
      </div>)}
    </div>
  </div>;
}
