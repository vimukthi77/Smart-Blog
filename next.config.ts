import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
  }
};

export default nextConfig;
