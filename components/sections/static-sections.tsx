import Image from "next/image";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Clock3,
  Code2,
  Computer,
  FileClock,
  FolderSync,
  HeartHandshake,
  History,
  Lightbulb,
  Mail,
  Network,
  ShieldAlert,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { roles } from "@/content/roles";
import { roadmap, type RoadmapStatus } from "@/content/roadmap";
import { technologies } from "@/content/site";
import type { GitHubMetrics, GitHubReleaseInfo } from "@/lib/github";
import { PROJECT_LINKS } from "@/lib/links";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/reveal";
import { RoleCard } from "@/components/ui/cards";
import { PrimaryButton, SecondaryButton, GhostButton, DangerButton } from "@/components/ui/buttons";
import { GitHubCard } from "@/components/ui/github-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { TechnologyBadge } from "@/components/ui/technology-badge";
import { WarningPanel } from "@/components/ui/warning-panel";
import { ContactForm } from "@/components/sections/contact-form";
import { GithubMark } from "@/components/icons/github-mark";
import { withBasePath } from "@/lib/site-url";

export function IntroSection() {
  const cards = [
    {
      icon: Boxes,
      title: "Единая информация",
      text: "Данные пациента, назначения, показатели, процедуры и документы находятся в одном рабочем контуре.",
    },
    {
      icon: UsersRound,
      title: "Разные рабочие роли",
      text: "Единый RemCard.exe открывает четыре рабочих места: врача, медсестры, планового и экстренного оперблока.",
    },
    {
      icon: Network,
      title: "Работа внутри организации",
      text: "Программа предназначена прежде всего для Windows-компьютеров и локальной сети медицинской организации.",
    },
  ];
  return (
    <section id="about" className="section intro-section" aria-labelledby="intro-title">
      <div className="site-container">
        <Reveal>
          <div className="intro-lead">
            <SectionHeading id="intro-title" eyebrow="О проекте" title="Что такое RemCard ICU" />
            <p>
              RemCard — настольное приложение для ведения пациента в отделении реанимации и во
              время операции. Врач, медицинская сестра и персонал операционного блока работают с
              общей информацией, но каждый видит инструменты, необходимые именно для своей роли.
            </p>
          </div>
        </Reveal>
        <RevealGroup className="intro-cards">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <RevealItem key={card.title}>
                <article className="info-card">
                  <span aria-hidden="true"><Icon /></span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

export function SeoDirectorySection() {
  const pages = [
    { title: "Электронная реанимационная карта", text: "Пациент, назначения, показатели, процедуры и документы в одном рабочем контуре.", href: withBasePath("/elektronnaya-reanimacionnaya-karta/") },
    { title: "Программа для ОРИТ", text: "Локальный Windows-сценарий для врача и медицинской сестры отделения реанимации.", href: withBasePath("/programma-dlya-orit/") },
    { title: "Операционный блок", text: "Регистрация операции и связанная история пациента от начала до завершения случая.", href: withBasePath("/operacionnyj-blok/") },
  ];
  return (
    <section className="section seo-directory-section" aria-labelledby="seo-directory-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="seo-directory-title"
            eyebrow="О RemCard ICU"
            title="Выберите рабочий сценарий"
            description="Отдельные страницы помогают быстро разобраться, подходит ли проект для конкретной задачи отделения."
          />
        </Reveal>
        <RevealGroup className="seo-directory-grid">
          {pages.map((page) => (
            <RevealItem key={page.href}>
              <a className="seo-directory-card" href={page.href}>
                <h3>{page.title}</h3>
                <p>{page.text}</p>
                <span>Подробнее <ArrowRight aria-hidden="true" /></span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function RolesSection() {
  return (
    <section id="roles" className="section roles-section" aria-labelledby="roles-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="roles-title"
            eyebrow="Для кого"
            title="Инструменты в контексте каждой роли"
            description="Врач, медсестра, плановый и экстренный оперблок доступны из общего окна RemCard.exe. Административные функции находятся в едином центре настроек."
          />
        </Reveal>
        <RevealGroup className="roles-grid">
          {roles.map((role) => <RevealItem key={role.title}><RoleCard role={role} /></RevealItem>)}
        </RevealGroup>
      </div>
    </section>
  );
}

export function LocalNetworkSection() {
  return (
    <section id="local-network" className="section local-network-section" aria-labelledby="network-title">
      <div className="site-container network-layout">
        <Reveal>
          <SectionHeading
            id="network-title"
            eyebrow="Локальная сеть"
            title="Совместная работа без облачного сервиса"
            description="Приложение запускается на Windows-компьютерах. Рабочие места могут использовать общую папку данных, а основная информация хранится в SQLite."
          />
          <ul className="check-list">
            <li><CheckCircle2 aria-hidden="true" />Интернет для обычной работы внутри организации не обязателен.</li>
            <li><CheckCircle2 aria-hidden="true" />Для совместной работы необходима доступная локальная сеть.</li>
            <li><CheckCircle2 aria-hidden="true" />Путь и права к общей папке настраиваются и проверяются отдельно.</li>
          </ul>
        </Reveal>
        <Reveal className="network-diagram" delay={0.08}>
          <div className="network-computer"><Computer aria-hidden="true" /><strong>Врачебный компьютер</strong></div>
          <div className="network-down"><ArrowDown aria-hidden="true" /><span>локальная сеть</span></div>
          <div className="network-folder"><FolderSync aria-hidden="true" /><strong>Общая папка данных</strong><small>SQLite · настройки · резервные копии</small></div>
          <div className="network-up"><ArrowDown aria-hidden="true" /><span>локальная сеть</span></div>
          <div className="network-computer"><Computer aria-hidden="true" /><strong>Компьютер медсестры</strong></div>
        </Reveal>
      </div>
      <div className="site-container">
        <WarningPanel title="Общая база требует подготовки">
          <p>Размещение общей SQLite-базы требует проверки прав доступа, качества сети, резервного копирования, восстановления и поведения при потере соединения.</p>
        </WarningPanel>
      </div>
    </section>
  );
}

export function SafetySection() {
  return (
    <section id="responsibility" className="section safety-section" aria-labelledby="safety-title">
      <div className="site-container safety-panel">
        <Reveal className="safety-copy">
          <span className="safety-icon" aria-hidden="true"><ShieldAlert /></span>
          <SectionHeading id="safety-title" eyebrow="Безопасность и ответственность" title="Экспериментальный проект требует независимой проверки" />
          <p className="safety-lead">
            RemCard является экспериментальным программным проектом и не зарегистрирован как
            медицинское изделие. Программа не заменяет клинические протоколы, профессиональное
            решение врача, медицинскую информационную систему организации или обязательный контроль
            медицинского персонала.
          </p>
        </Reveal>
        <RevealGroup className="safety-list">
          {[
            "Перед реальной эксплуатацией необходима техническая и клиническая проверка.",
            "Резервное копирование и восстановление нужно проверить на тестовой базе.",
            "В GitHub Issues нельзя публиковать реальные данные пациентов.",
            "Внедрение выполняется под ответственность использующей организации.",
          ].map((item, index) => (
            <RevealItem key={item}>
              <div><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function TechnologiesSection() {
  return (
    <section id="technologies" className="section technologies-section" aria-labelledby="technologies-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="technologies-title"
            eyebrow="Технологии"
            title="Понятный стек настольного приложения"
            description="RemCard собирается вокруг Python, Qt и SQLite, проверяется тестами и развивается открыто на GitHub."
          />
        </Reveal>
        <RevealGroup className="technologies-grid">
          {technologies.map((technology) => <RevealItem key={technology.name}><TechnologyBadge technology={technology} /></RevealItem>)}
        </RevealGroup>
      </div>
    </section>
  );
}

export function OpenSourceSection({
  metrics,
  release,
}: {
  metrics: GitHubMetrics;
  release: GitHubReleaseInfo;
}) {
  const releaseUrl = release.url;
  const releaseLabel = `Скачать Windows-релиз ${release.version}`;
  return (
    <section id="open-source" className="section open-source-section" aria-labelledby="open-source-title">
      <div className="site-container open-source-layout">
        <Reveal className="open-source-copy">
          <StatusBadge tone="success"><Code2 size={14} aria-hidden="true" />RemCard Source License · доступный код</StatusBadge>
          <SectionHeading
            id="open-source-title"
            eyebrow="Исходный код"
            title="RemCard развивается публично"
            description="Исходный код доступен на GitHub по RemCard Proprietary Source License 1.1. Физические лица могут изучать, изменять и использовать проект некоммерчески; организационное и коммерческое использование требует письменного разрешения."
          />
          <p className="release-summary">
            <strong>Версия {release.version}.</strong>{" "}
            {release.version === "5.1.12" ? (
              <>
                В релизе от 25 октября 2026 года исправлено поле даты и времени поступления:
                значения полностью видны, календарь и редактирование времени работают в светлой
                и тёмной темах. Обновление 5.1.12 необязательное для клиентов 5.1.11:
                схема общей базы остаётся 28, минимальная версия клиента — 5.1.11.
                Миграции общей базы и повышение минимальной версии в этой сборке отключены.
              </>
            ) : (
              <>Описание изменений и требования к установке опубликованы на странице этого релиза.</>
            )}
          </p>
          <div className="open-source-actions">
            <PrimaryButton href={PROJECT_LINKS.repository} external><Star size={17} aria-hidden="true" />Поставить звезду</PrimaryButton>
            <SecondaryButton href={PROJECT_LINKS.repository} external><GithubMark width={17} height={17} aria-hidden="true" />Открыть репозиторий</SecondaryButton>
            <DangerButton href={PROJECT_LINKS.issues} external>Сообщить об ошибке</DangerButton>
            <GhostButton href={PROJECT_LINKS.documentation} external><BookOpen size={17} aria-hidden="true" />Посмотреть документацию</GhostButton>
            <GhostButton href={PROJECT_LINKS.changelog} external><History size={17} aria-hidden="true" />История изменений</GhostButton>
          </div>
          <a className="release-link" href={releaseUrl} target="_blank" rel="noreferrer"><FileClock aria-hidden="true" />{releaseLabel} <span aria-hidden="true">↗</span></a>
        </Reveal>
        <Reveal delay={0.1}><GitHubCard metrics={metrics} /></Reveal>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section id="story" className="section story-section" aria-labelledby="story-title">
      <div className="site-container story-layout">
        <Reveal className="story-mark"><HeartHandshake aria-hidden="true" /><span>Практическая задача<br />стала публичным проектом</span></Reveal>
        <Reveal className="story-copy" delay={0.06}>
          <SectionHeading id="story-title" eyebrow="История проекта" title="Создан из реального рабочего контекста" />
          <blockquote>
            RemCard создаётся практикующим врачом анестезиологом-реаниматологом. Проект появился из необходимости уменьшить повторное заполнение документов, объединить информацию о пациенте и сделать рабочий процесс отделения более наглядным.
          </blockquote>
          <p>Проект открыт для проверки и помощи. На сайте не приводятся неподтверждённые данные о внедрениях, организациях или количестве пользователей.</p>
          <div className="builder-directory">
            <a href={PROJECT_LINKS.clinicianDirectory} target="_blank" rel="noreferrer">
              <Image
                src={withBasePath("/images/clinicians-that-code-verified.svg")}
                alt="Clinicians That Code: verified builder — карточка автора RemCard"
                width={260}
                height={28}
                unoptimized
              />
            </a>
            <p>Автор RemCard представлен в каталоге Clinicians That Code.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function EnglishOverviewSection() {
  return (
    <section id="english" className="section english-section" lang="en" aria-labelledby="english-title">
      <div className="site-container english-overview">
        <SectionHeading
          id="english-title"
          eyebrow="English overview"
          title="Windows charting for intensive care and the operating room"
          description="RemCard ICU is an experimental desktop application developed by Vadim Bityutsky, an anaesthesiologist and intensive care physician. It brings patient records and shift workflows together for doctors, nurses and operating-room staff. The current interface and main documentation are in Russian."
        />
        <div className="english-details">
          <p><strong>Shared clinical records.</strong> Role-specific workspaces cover prescriptions and administration records, vital signs, fluid balance, ventilation, procedures, laboratory results, operative events, reports and an archive.</p>
          <p><strong>Local-network deployment.</strong> Windows workstations use a shared data folder and a central SQLite database. Validated local read replicas help with reading; committed central records remain the source of truth. Network behaviour, permissions, backups and recovery require acceptance testing in the intended environment.</p>
          <p><strong>Source-available licence.</strong> The code is published under the RemCard Proprietary Source License 1.1. Non-commercial use by individuals is permitted; organisational use and any commercial use require prior written permission from the copyright holder.</p>
          <p><strong>Experimental status.</strong> RemCard is not a registered medical device and does not replace clinical judgement or protocols. Automated tests and built-in safeguards do not establish clinical safety. Independent technical, security and clinical validation, local acceptance and a backup workflow are required before real-world use.</p>
        </div>
        <div className="open-source-actions">
          <PrimaryButton href={PROJECT_LINKS.repository} external><GithubMark width={17} height={17} aria-hidden="true" />Source code</PrimaryButton>
          <SecondaryButton href={withBasePath("/#interface")}>Demo screenshots</SecondaryButton>
          <GhostButton href={PROJECT_LINKS.license} external>Read the licence</GhostButton>
        </div>
      </div>
    </section>
  );
}

const statusTone: Record<RoadmapStatus, "success" | "progress" | "planned" | "research"> = {
  "Реализовано": "success",
  "Развивается": "progress",
  "Запланировано": "planned",
  "Исследуется": "research",
};

export function RoadmapSection() {
  const statusIcons = { "Реализовано": CheckCircle2, "Развивается": Activity, "Запланировано": Clock3, "Исследуется": Lightbulb };
  return (
    <section id="roadmap" className="section roadmap-section" aria-labelledby="roadmap-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="roadmap-title"
            eyebrow="Без жёстких сроков"
            title="Направления развития"
            description="Это обзор направлений, а не обещание дат выпуска. Реализованные клинические модули продолжают уточняться и проверяться."
          />
        </Reveal>
        <RevealGroup className="roadmap-grid">
          {roadmap.map((item) => {
            const Icon = statusIcons[item.status];
            return <RevealItem key={item.title}><article className="roadmap-item"><Icon aria-hidden="true" /><h3>{item.title}</h3><StatusBadge tone={statusTone[item.status]}>{item.status}</StatusBadge></article></RevealItem>;
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section id="contact" className="section final-cta-section" aria-labelledby="final-cta-title">
      <div className="site-container final-cta-panel">
        <Reveal className="final-cta-copy">
          <span className="final-cta-icon" aria-hidden="true"><Sparkles /></span>
          <h2 id="final-cta-title">Помогите сделать инструменты для реанимации удобнее</h2>
          <p>RemCard развивается как публичный source-available проект. Звезда на GitHub, сообщение об ошибке, предложение врача или вклад разработчика помогают проекту становиться устойчивее и понятнее.</p>
          <div className="final-cta-actions">
            <PrimaryButton href={PROJECT_LINKS.repository} external><GithubMark width={17} height={17} aria-hidden="true" />Открыть RemCard на GitHub</PrimaryButton>
            <SecondaryButton href={PROJECT_LINKS.repository} external><Star size={17} aria-hidden="true" />Поставить звезду</SecondaryButton>
            <DangerButton href={PROJECT_LINKS.issues} external>Сообщить об ошибке</DangerButton>
          </div>
          <a className="email-direct" href={PROJECT_LINKS.email}><Mail size={17} aria-hidden="true" />menfise@mail.ru</a>
        </Reveal>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </div>
    </section>
  );
}
