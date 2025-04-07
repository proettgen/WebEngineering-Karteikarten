import type { NextConfig } from "next";

type NodeEnvType = { BASE_PATH?: "gh-pages" | string };
declare global {
  namespace NodeJS {
    interface ProcessEnv extends NodeEnvType {}
  }
}

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH,
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
