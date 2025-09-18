import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out for local development with Netlify functions
  trailingSlash: true,
  images: { unoptimized: true },
  // Allow cross-origin requests for development
  async rewrites() {
    return [
      {
        source: '/.netlify/functions/:path*',
        destination: 'http://localhost:8888/.netlify/functions/:path*',
      },
    ];
  },
};

export default nextConfig;
