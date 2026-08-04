import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Скриншоты уже подготовлены в веб-размере. Прямая раздача сохраняет размеры,
  // lazy-loading и отсутствие layout shift от next/image, не требуя IMAGES binding.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
