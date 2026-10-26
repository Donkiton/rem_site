"use client";

import { useI18n } from "@/components/i18n-provider";

import Image from "next/image";
import { Mail } from "lucide-react";
import { PROJECT_LINKS } from "@/lib/links";
import { GithubMark } from "@/components/icons/github-mark";
import { withBasePath } from "@/lib/site-url";
import { ProjectVersionValue } from "@/components/project-version-provider";

export function Footer({ releaseUrl }: { releaseUrl: string }) {
  const { t, l } = useI18n();
  const links = [
    ["GitHub", PROJECT_LINKS.repository],
    ["Документация", PROJECT_LINKS.documentation],
    ["Сообщить об ошибке", PROJECT_LINKS.issues],
    ["История изменений", PROJECT_LINKS.changelog],
    ["Read the licence", PROJECT_LINKS.license],
    ["Windows-релиз", releaseUrl],
  ] as const;
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <a className="brand" href={l(withBasePath("/"))}><Image src={withBasePath("/remcardicon.png")} alt="" width={44} height={44} unoptimized /><span>RemCard ICU</span></a>
          <p>{t("Windows-приложение с доступным исходным кодом для процессов реанимации и операционного блока.")}</p>
          <span className="footer-version">{t("Версия")} <ProjectVersionValue /></span>
        </div>
        <nav aria-label={t("Ссылки проекта")}>
          <h2>{t("Проект")}</h2>
          {links.map(([label, href]) => <a key={label} href={l(href)} target="_blank" rel="noreferrer">{t(label)}<span aria-hidden="true">↗</span></a>)}
        </nav>
        <div className="footer-contact">
          <h2>{t("Связь")}</h2>
          <a href={PROJECT_LINKS.email}><Mail aria-hidden="true" />menfise@mail.ru</a>
          <a href={PROJECT_LINKS.repository} target="_blank" rel="noreferrer"><GithubMark aria-hidden="true" />Donkiton/rem_card</a>
          <p>{t("Не отправляйте реальные данные пациентов по электронной почте или в Issues.")}</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>{t("RemCard ICU — экспериментальный source-available проект. Некоммерческое использование физическими лицами разрешено; организационное и коммерческое использование требует письменного разрешения.")}</p>
        <a href={l(withBasePath("/"))}>{t("На главную ↑")}</a>
      </div>
    </footer>
  );
}
