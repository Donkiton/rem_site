"use client";

import { useI18n } from "@/components/i18n-provider";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/content/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { cx } from "@/lib/utils";

export function FAQAccordion() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section id="faq" className="section faq-section" aria-labelledby="faq-title">
      <div className="site-container faq-layout">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title={t("Частые вопросы")}
            description={t("Коротко о статусе проекта, платформе, данных и способах помочь.")}
          />
          <p className="faq-side-note">
            {t("Не нашли ответ? Напишите автору проекта или задайте вопрос в GitHub Issues без реальных данных пациентов.")}</p>
        </Reveal>
        <Reveal className="faq-list" delay={0.08}>
          {faqItems.map((item, index) => {
            const open = openIndex === index;
            const contentId = `faq-answer-${index}`;
            return (
              <div className={cx("faq-item", open && "open")} key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={contentId}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span>{t(item.question)}</span>
                    <ChevronDown aria-hidden="true" />
                  </button>
                </h3>
                <div id={contentId} className="faq-answer" hidden={!open}>
                  <p>{t(item.answer)}</p>
                  {"link" in item && item.link ? (
                    <a href={item.link.href} target="_blank" rel="noreferrer">
                      {t(item.link.label)} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
