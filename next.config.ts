import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["santiyeilan.local"],
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
