import type { Metadata } from "next";
import { withBasePath } from "@/lib/site-url";
import { resolveSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Страница не найдена — RemCard ICU",
  alternates: { canonical: resolveSiteUrl().toString() },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <span>404</span>
        <h1>Страница не найдена</h1>
        <p>Вернитесь на главную страницу RemCard ICU.</p>
        <a href={withBasePath("/")}>Перейти на главную</a>
      </div>
    </main>
  );
}
