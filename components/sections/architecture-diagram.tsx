"use client";

import { useI18n } from "@/components/i18n-provider";

import Image from "next/image";
import { useState } from "react";
import {
  BriefcaseMedical,
  ChevronDown,
  Database,
  FolderSync,
  HeartPulse,
  Layers3,
  ShieldPlus,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { cx } from "@/lib/utils";
import { withBasePath } from "@/lib/site-url";
import { PROJECT_LINKS } from "@/lib/links";
import { SecondaryButton } from "@/components/ui/buttons";

const roleNodes = [
  { id: "doctor", label: "Врач", icon: BriefcaseMedical, detail: "Карта, назначения и отчёты" },
  { id: "nurse", label: "Медсестра", icon: HeartPulse, detail: "Выполнения и наблюдение" },
  { id: "operating", label: "Оперблок", icon: ShieldPlus, detail: "Операционный случай и события" },
] as const;

export function ArchitectureDiagram() {
  const { t, locale } = useI18n();
  const [activeRole, setActiveRole] = useState<(typeof roleNodes)[number]["id"]>("doctor");
  return (
    <section id="architecture" className="section architecture-section" aria-labelledby="architecture-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="architecture-title"
            eyebrow={t("Как устроено")}
            title={t("Разные рабочие места — общая информация")}
            description={t("Каждая роль получает свой интерфейс, а подтверждённые изменения сохраняются в общей папке данных.")}
          />
        </Reveal>
        <div className="architecture-grid">
          <Reveal className="architecture-interactive">
            <div className="architecture-roles" aria-label={t("Выберите рабочее место")}>
              {roleNodes.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    type="button"
                    key={role.id}
                    className={cx("architecture-node role-node", activeRole === role.id && "active")}
                    aria-pressed={activeRole === role.id}
                    onClick={() => setActiveRole(role.id)}
                    onMouseEnter={() => setActiveRole(role.id)}
                  >
                    <Icon aria-hidden="true" />
                    <span><strong>{t(role.label)}</strong><small>{t(role.detail)}</small></span>
                  </button>
                );
              })}
            </div>
            <div className="architecture-connectors" aria-hidden="true">
              <i className={cx(activeRole === "doctor" && "active")} />
              <i className={cx(activeRole === "nurse" && "active")} />
              <i className={cx(activeRole === "operating" && "active")} />
            </div>
            <div className="architecture-storage">
              <div className="architecture-node shared-node">
                <FolderSync aria-hidden="true" />
                <span><strong>{t("Общая папка данных")}</strong><small>{t("Доступна рабочим компьютерам в локальной сети")}</small></span>
              </div>
              <span className="storage-arrow" aria-hidden="true">→</span>
              <div className="architecture-node database-node">
                <Database aria-hidden="true" />
                <span><strong>SQLite</strong><small>{t("Основные данные и общие настройки")}</small></span>
              </div>
            </div>
            <div className="commit-note">
              <span aria-hidden="true">✓</span>
              <p>
                {t("Сообщение об успешном сохранении появляется только после фактической записи данных в базу.")}</p>
            </div>
          </Reveal>
          <Reveal className="architecture-reference" delay={0.08}>
            <div className="workflow-image-frame">
              <Image
                src={withBasePath(`/images/remcard/remcard-workflow${locale === "ru" ? "" : `.${locale}`}.svg`)}
                alt={t("Схема взаимодействия рабочих мест RemCard с общей папкой данных")}
                width={1200}
                height={490}
                sizes="(max-width: 900px) 100vw, 44vw"
                unoptimized
              />
            </div>
            <p>
              {t("Для чтения используются проверенные локальные реплики; подтверждённые записи общей базы остаются источником истины. При аварийном входе приложение проверяет пригодность и возраст локальной копии. Возврат в сетевой режим и перенос изменений выполняются отдельным сценарием.")}</p>
          </Reveal>
        </div>
        <details className="developer-details">
          <summary><Layers3 aria-hidden="true" />{t("Для разработчиков")}<ChevronDown className="details-chevron" aria-hidden="true" /></summary>
          <div className="developer-details-body">
            <p>{t("Основной технический поток:")}</p>
            <div className="technical-flow" aria-label={t("Технический поток данных")}>
              <code>{t("Интерфейс")}</code><span>→</span><code>{t("прикладные сервисы")}</code><span>→</span><code>{t("слой доступа к данным")}</code><span>→</span><code>SQLite</code>
            </div>
            <p>
              {t("Сервисы отделяют пользовательский интерфейс от операций с данными. Запись выполняется транзакционно; сетевой профиль, резервное копирование и восстановление относятся к зонам повышенного риска и описаны в документации проекта.")}</p>
            <SecondaryButton href={PROJECT_LINKS.codemap} external>
              <Layers3 size={17} aria-hidden="true" />
              {t("Открыть интерактивную карту архитектуры")}</SecondaryButton>
          </div>
        </details>
      </div>
    </section>
  );
}
