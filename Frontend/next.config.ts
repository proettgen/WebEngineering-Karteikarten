import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/WebEngineering-Karteikarten",
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
