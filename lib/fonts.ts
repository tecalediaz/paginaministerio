import { Baloo_2, Fredoka } from "next/font/google";
import localFont from "next/font/local";

/**
 * Antenna (Ford Antenna) — pesos usados en UI.
 * Archivos en /fonts/antenna (fuera de public: next/font los self-hostea).
 */
export const antenna = localFont({
  src: [
    {
      path: "../fonts/antenna/FordAntenna-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/antenna/FordAntenna-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/antenna/FordAntenna-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/antenna/FordAntenna-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/antenna/FordAntenna-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/antenna/FordAntenna-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-antenna",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

/** Tipografía lúdica para Mes de las Infancias */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

/** Display más divertido para el título del teaser */
export const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});
