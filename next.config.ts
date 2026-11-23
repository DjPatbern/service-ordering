import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  // Vercel uses the standard .next directory. The override is only for local
  // verification when an existing dev process owns .next.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;
