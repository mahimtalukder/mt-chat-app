import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
