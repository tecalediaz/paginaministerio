import type { Metadata } from "next";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { antenna, burgerFree, moreSugar } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} | ${site.province}`,
    template: `%s | ${site.shortName} — La Rioja`,
  },
  description:
    "Sitio oficial del Ministerio de Desarrollo, Igualdad e Integración Social de la Provincia de La Rioja. Agenda social, institucional y contacto.",
  metadataBase: new URL("https://desarrollosocial.larioja.gob.ar"),
  icons: {
    icon: [{ url: "/logo-gob-rioja.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo-gob-rioja.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: `${site.fullName} | ${site.province}`,
    description:
      "Trabajamos por el bienestar y el progreso de La Rioja. Agenda social, institucional y contacto.",
    locale: "es_AR",
    type: "website",
    siteName: site.fullName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} | ${site.province}`,
    description:
      "Trabajamos por el bienestar y el progreso de La Rioja.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${antenna.variable} ${moreSugar.variable} ${burgerFree.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
