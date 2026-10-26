import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";
import "./globals.css";

export const metadata: Metadata = {
  title: "Страница не найдена — RemCard ICU",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <html lang="ru"><body style={{ fontFamily: "system-ui, sans-serif" }}><NotFoundContent /></body></html>
  );
}
