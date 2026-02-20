import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  // Ensure Turbopack uses this project folder as root to avoid
  // including parent folders with non-ASCII characters in generated ids.
  turbopack: {
    root: './',
  },
};

export default nextConfig;
