"use client";

import { useI18n } from "@/components/i18n-provider";

import { motion, useReducedMotion } from "motion/react";
import { patientJourney } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/reveal";

export function Timeline() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const transition = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <section id="workflow" className="section timeline-section" aria-labelledby="timeline-title">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            id="timeline-title"
            eyebrow={t("Путь пациента")}
            title={t("Как проходит работа с пациентом")}
            description={t("Записи последовательно дополняют одну карту: от регистрации до завершения случая или архива.")}
          />
        </Reveal>
        <RevealGroup className="patient-timeline">
          <div className="timeline-track" aria-hidden="true">
            <motion.div
              className="timeline-fill timeline-fill-desktop"
              initial={reduceMotion ? false : { scaleX: 0 }}
              whileInView={reduceMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={transition}
            />
            <motion.div
              className="timeline-fill timeline-fill-mobile"
              initial={reduceMotion ? false : { scaleY: 0 }}
              whileInView={reduceMotion ? undefined : { scaleY: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={transition}
            />
          </div>
          {patientJourney.map((step, index) => (
            <RevealItem className="timeline-step" key={step}>
              <span className="timeline-marker">{index + 1}</span>
              <h3>{t(step)}</h3>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
