import { headers } from "next/headers";

const LOCAL_SITE_URL = "http://localhost:3000";

export async function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      // Некорректная переменная окружения не должна ломать страницу.
    }
  }

  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol =
      requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
    if (host) return new URL(`${protocol}://${host}`);
  } catch {
    // Метаданные могут вычисляться без контекста запроса во время сборки.
  }

  return new URL(LOCAL_SITE_URL);
}
