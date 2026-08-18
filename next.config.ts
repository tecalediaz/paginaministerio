import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@dimforge/rapier3d-compat"],
  transpilePackages: ["meshline", "@react-three/rapier"],
};

export default nextConfig;
