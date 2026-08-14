import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:3000/api/:path*", // Proxy interno al backend
      },
    ];
  },
};

export default nextConfig;
