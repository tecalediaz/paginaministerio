import localFont from "next/font/local";

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
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
  adjustFontFallback: "Arial",
});
