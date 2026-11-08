import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The framework reports its own name in a response header by default; there
  // is no reason to volunteer it.
  poweredByHeader: false,
};

export default nextConfig;
