import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // อนุญาตให้โหลดรูปภาพจาก Unsplash
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ensure Turbopack uses this project folder as root to avoid
  // including parent folders with non-ASCII characters in generated ids.
  turbopack: {
    root: './',
  },
};

export default nextConfig;