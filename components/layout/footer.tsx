import Image from "next/image";
import { Mail } from "lucide-react";
import { PROJECT_LINKS } from "@/lib/links";
import { GithubMark } from "@/components/icons/github-mark";
import { withBasePath } from "@/lib/site-url";
import { ProjectVersionValue } from "@/components/project-version-provider";

export function Footer({ releaseUrl }: { releaseUrl: string }) {
  const links = [
    ["GitHub", PROJECT_LINKS.repository],
    ["Документация", PROJECT_LINKS.documentation],
    ["Issues", PROJECT_LINKS.issues],
    ["Changelog", PROJECT_LINKS.changelog],
    ["License", PROJECT_LINKS.license],
    ["Windows-релиз", releaseUrl],
  ] as const;
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top"><Image src={withBasePath("/remcardicon.png")} alt="" width={44} height={44} unoptimized /><span>RemCard ICU</span></a>
          <p>Windows-приложение с доступным исходным кодом для процессов реанимации и операционного блока.</p>
          <span className="footer-version">Версия <ProjectVersionValue /></span>
        </div>
        <nav aria-label="Ссылки проекта">
          <h2>Проект</h2>
          {links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a>)}
        </nav>
        <div className="footer-contact">
          <h2>Связь</h2>
          <a href={PROJECT_LINKS.email}><Mail aria-hidden="true" />menfise@mail.ru</a>
          <a href={PROJECT_LINKS.repository} target="_blank" rel="noreferrer"><GithubMark aria-hidden="true" />Donkiton/rem_card</a>
          <p>Не отправляйте реальные данные пациентов по электронной почте или в Issues.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>RemCard ICU — экспериментальный source-available проект. Некоммерческое использование физическими лицами разрешено; организационное и коммерческое использование требует письменного разрешения.</p>
        <a href="#top">Наверх ↑</a>
      </div>
    </footer>
  );
}
