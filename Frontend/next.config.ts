import type { NextConfig } from "next";

type NodeEnvType = { BASE_PATH?: string };
declare global {
  namespace NodeJS {
    interface ProcessEnv extends NodeEnvType {}
  }
}

const basePathValue = process.env.BASE_PATH ? `/${process.env.BASE_PATH}` : "";

const nextConfig: NextConfig = {
  basePath: basePathValue,
  assetPrefix: basePathValue ? `${basePathValue}/` : "",
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
