import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `pg` abre sockets; no empaquetarlo dentro del bundle de servidor.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
