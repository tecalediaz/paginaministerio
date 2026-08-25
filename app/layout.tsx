import type { Metadata, Viewport } from "next";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { antenna, burgerFree, moreSugar } from "@/lib/fonts";
import "./globals.css";

const ogImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: `${site.fullName} — ${site.province}`,
};

export const viewport: Viewport = {
  themeColor: "#4caf50",
};

export const metadata: Metadata = {
  title: {
    default: `${site.fullName} | ${site.province}`,
    template: `%s | ${site.shortName} — La Rioja`,
  },
  description:
    "Sitio oficial del Ministerio de Desarrollo, Igualdad e Integración Social de la Provincia de La Rioja. Agenda social, institucional y contacto.",
  metadataBase: new URL("https://desarrollosocial.larioja.gob.ar"),
  icons: {
    icon: [
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: `${site.fullName} | ${site.province}`,
    description:
      "Trabajamos por el bienestar y el progreso de La Rioja. Agenda social, institucional y contacto.",
    locale: "es_AR",
    type: "website",
    siteName: site.fullName,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} | ${site.province}`,
    description:
      "Trabajamos por el bienestar y el progreso de La Rioja.",
    images: [ogImage.url],
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
