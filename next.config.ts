import type { NextConfig } from "next";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/rem_site" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Скриншоты уже подготовлены в веб-размере. Прямая раздача сохраняет размеры,
  // lazy-loading и отсутствие layout shift от next/image, не требуя IMAGES binding.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
