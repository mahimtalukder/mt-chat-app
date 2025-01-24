import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com", "utfs.io"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/contracts",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
