import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the app to be accessed from any hostname/IP on the local network
  // This lets phones and tablets on the same Wi-Fi reach the dev server
  images: {
    remotePatterns: [],
    // Allow serving local /public images from any origin
    unoptimized: false,
  },

  // Trust requests coming from the local IP during development
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
