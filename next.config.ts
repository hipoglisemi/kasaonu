import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/proxy',
      },
      {
        pathname: '/logos/**',
      },
      {
        pathname: '/images/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.paraf.com.tr',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'www.yapikrediplay.com.tr',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
