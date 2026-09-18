import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/tramites/taller-lengua-de-senas",
        destination: "/tramites/manos-a-la-obra-panaderia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
