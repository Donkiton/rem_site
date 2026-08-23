const PUBLIC_SITE_URL = "https://donkiton.github.io/rem_site/";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      // Некорректная переменная окружения не должна ломать страницу.
    }
  }

  return new URL(PUBLIC_SITE_URL);
}

export function withBasePath(path: string) {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
