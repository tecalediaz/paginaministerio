import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { antenna } from "@/lib/fonts";
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
    "Sitio oficial del Ministerio de Desarrollo, Igualdad e Integración Social de la Provincia de La Rioja. Programas, trámites, áreas y contacto.",
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
    description: site.tagline,
    locale: "es_AR",
    type: "website",
    siteName: site.fullName,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.fullName} | ${site.province}`,
    description: site.tagline,
    images: [ogImage.url],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" className={`${antenna.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
