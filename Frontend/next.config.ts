import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? "/WebEngineering-Karteikarten" : "",
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
