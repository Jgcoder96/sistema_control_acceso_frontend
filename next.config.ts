import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'teg-s3-bucket.s3.us-east-2.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:3000/api/:path*", // Proxy interno al backend
      },
      {
        source: "/socket.io/:path*",
        destination: "http://api:3000/socket.io/:path*", // Proxy interno de WebSockets al backend
      },
    ];
  },
};

export default nextConfig;
