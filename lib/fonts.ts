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
