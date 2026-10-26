"use client";

import { useI18n } from "@/components/i18n-provider";

import { useState } from "react";
import { Check, Files, Search, Sparkles, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { cx } from "@/lib/utils";

const before = [
  "Данные находятся в разных журналах",
  "Назначения приходится переписывать",
  "Трудно быстро оценить динамику показателей",
  "Врач и медсестра ищут одну информацию в разных местах",
  "Документирование занимает значительную часть смены",
];

const after = [
  "Одна карта пациента",
  "Единый список назначений",
  "Графики жизненно важных показателей",
  "История процедур и исследований",
  "Отдельные рабочие места для разных ролей",
  "Отчёты формируются из уже внесённых данных",
];

export function ComparisonSection() {
  const { t } = useI18n();
  const [active, setActive] = useState<"before" | "after">("after");
  return (
    <section id="comparison" className="section comparison-section" aria-labelledby="comparison-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="comparison-title"
            eyebrow={t("Задача продукта")}
            title={t("Меньше разрозненных записей — больше связного контекста")}
            description={t("RemCard не принимает решения за специалиста. Он помогает держать рабочую информацию в одном понятном контуре.")}
          />
        </Reveal>
        <div className="comparison-toggle" role="group" aria-label={t("Сравнить рабочий процесс")}>
          <button
            type="button"
            className={cx(active === "before" && "active")}
            aria-pressed={active === "before"}
            onClick={() => setActive("before")}
          >
            {t("До RemCard")}</button>
          <button
            type="button"
            className={cx(active === "after" && "active")}
            aria-pressed={active === "after"}
            onClick={() => setActive("after")}
          >
            {t("С RemCard")}</button>
        </div>
        <div className="comparison-grid">
          <article className={cx("comparison-card before-card", active === "before" && "active")}>
            <div className="comparison-card-heading">
              <span aria-hidden="true"><Files /></span>
              <div>
                <small>{t("До")}</small>
                <h3>{t("Без единого рабочего пространства")}</h3>
              </div>
            </div>
            <ul>
              {before.map((item) => (
                <li key={item}><X size={17} aria-hidden="true" />{t(item)}</li>
              ))}
            </ul>
            <div className="comparison-motif" aria-hidden="true"><Search /><span /><span /><span /></div>
          </article>
          <div className="comparison-arrow" aria-hidden="true">→</div>
          <article className={cx("comparison-card after-card", active === "after" && "active")}>
            <div className="comparison-card-heading">
              <span aria-hidden="true"><Sparkles /></span>
              <div>
                <small>{t("С RemCard")}</small>
                <h3>{t("Общий рабочий контур")}</h3>
              </div>
            </div>
            <ul>
              {after.map((item) => (
                <li key={item}><Check size={17} aria-hidden="true" />{t(item)}</li>
              ))}
            </ul>
            <div className="comparison-flow" aria-hidden="true">
              <span>{t("Врач")}</span><i /><span>{t("Карта")}</span><i /><span>{t("Медсестра")}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
