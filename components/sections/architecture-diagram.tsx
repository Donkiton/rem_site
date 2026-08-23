"use client";

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
  const [activeRole, setActiveRole] = useState<(typeof roleNodes)[number]["id"]>("doctor");
  return (
    <section id="architecture" className="section architecture-section" aria-labelledby="architecture-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="architecture-title"
            eyebrow="Как устроено"
            title="Разные рабочие места — общая информация"
            description="Каждая роль получает свой интерфейс, а подтверждённые изменения сохраняются в общей папке данных."
          />
        </Reveal>
        <div className="architecture-grid">
          <Reveal className="architecture-interactive">
            <div className="architecture-roles" aria-label="Выберите рабочее место">
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
                    <span><strong>{role.label}</strong><small>{role.detail}</small></span>
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
                <span><strong>Общая папка данных</strong><small>Доступна рабочим компьютерам в локальной сети</small></span>
              </div>
              <span className="storage-arrow" aria-hidden="true">→</span>
              <div className="architecture-node database-node">
                <Database aria-hidden="true" />
                <span><strong>SQLite</strong><small>Основные данные и общие настройки</small></span>
              </div>
            </div>
            <div className="commit-note">
              <span aria-hidden="true">✓</span>
              <p>
                Сообщение об успешном сохранении появляется только после фактической записи данных
                в базу.
              </p>
            </div>
          </Reveal>
          <Reveal className="architecture-reference" delay={0.08}>
            <div className="workflow-image-frame">
              <Image
                src={withBasePath("/images/remcard/remcard-workflow.svg")}
                alt="Схема взаимодействия рабочих мест RemCard с общей папкой данных"
                width={1400}
                height={850}
                sizes="(max-width: 900px) 100vw, 44vw"
                unoptimized
              />
            </div>
            <p>
              Рабочие места получают обновления через журнал изменений и подготовленные снимки
              данных. Ограниченный аварийный offline-сценарий предусмотрен для части процессов
              операционного блока, а не для всей системы.
            </p>
          </Reveal>
        </div>
        <details className="developer-details">
          <summary><Layers3 aria-hidden="true" />Для разработчиков<ChevronDown className="details-chevron" aria-hidden="true" /></summary>
          <div className="developer-details-body">
            <p>Основной технический поток:</p>
            <div className="technical-flow" aria-label="Технический поток данных">
              <code>Интерфейс</code><span>→</span><code>прикладные сервисы</code><span>→</span><code>слой доступа к данным</code><span>→</span><code>SQLite</code>
            </div>
            <p>
              Сервисы отделяют пользовательский интерфейс от операций с данными. Запись выполняется
              транзакционно; сетевой профиль, резервное копирование и восстановление относятся к
              зонам повышенного риска и описаны в документации проекта.
            </p>
            <SecondaryButton href={PROJECT_LINKS.codemap} external>
              <Layers3 size={17} aria-hidden="true" />
              Открыть интерактивную карту архитектуры
            </SecondaryButton>
          </div>
        </details>
      </div>
    </section>
  );
}
