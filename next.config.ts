import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/teacher-management-portal',
  assetPrefix: '/teacher-management-portal',
  eslint: {
    ignoreDuringBuilds: true,
  }

};


export default nextConfig;
