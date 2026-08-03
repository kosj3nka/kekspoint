import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  allowedDevOrigins: ["192.168.1.10"],
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ujpzsbcxicbpghadccft.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
