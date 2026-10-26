"use client";

import { useI18n } from "@/components/i18n-provider";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { features } from "@/content/features";
import { FeatureCard } from "@/components/ui/cards";
import { IconButton } from "@/components/ui/buttons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { cx } from "@/lib/utils";

export function FeatureCarousel() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [viewportRef, api] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(features.length);
  const [hovered, setHovered] = useState(false);
  const [interactionStopped, setInteractionStopped] = useState(false);

  const sync = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setSnapCount(api.scrollSnapList().length);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const frame = window.requestAnimationFrame(sync);
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      window.cancelAnimationFrame(frame);
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api, sync]);

  useEffect(() => {
    if (!api || reduceMotion || hovered || interactionStopped) return;
    const timer = window.setInterval(() => api.scrollNext(false), 5200);
    return () => window.clearInterval(timer);
  }, [api, hovered, interactionStopped, reduceMotion]);

  const stopAnd = (callback: () => void) => {
    setInteractionStopped(true);
    callback();
  };

  return (
    <section id="features" className="section features-section" aria-labelledby="features-title">
      <div className="site-container">
        <Reveal>
          <div className="section-heading-row">
            <SectionHeading
              id="features-title"
              eyebrow={t("Основные возможности")}
              title={t("Двенадцать модулей — одна карта")}
              description={t("Каждый модуль решает свою часть рабочего процесса, но остаётся связан с пациентом, сменой и ролью пользователя.")}
            />
            <div className="carousel-controls">
              <IconButton aria-label={t("Предыдущий модуль")} onClick={() => stopAnd(() => api?.scrollPrev(Boolean(reduceMotion)))}>
                <ChevronLeft aria-hidden="true" />
              </IconButton>
              <IconButton aria-label={t("Следующий модуль")} onClick={() => stopAnd(() => api?.scrollNext(Boolean(reduceMotion)))}>
                <ChevronRight aria-hidden="true" />
              </IconButton>
              <IconButton
                aria-label={interactionStopped ? t("Возобновить автопрокрутку") : t("Остановить автопрокрутку")}
                onClick={() => setInteractionStopped((stopped) => !stopped)}
              >
                {interactionStopped ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </IconButton>
            </div>
          </div>
        </Reveal>
        <div
          className="embla feature-embla"
          role="region"
          aria-roledescription={t("карусель")}
          aria-label={t("Модули RemCard")}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={() => setInteractionStopped(true)}
          onFocusCapture={() => setInteractionStopped(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              stopAnd(() => api?.scrollPrev(Boolean(reduceMotion)));
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              stopAnd(() => api?.scrollNext(Boolean(reduceMotion)));
            }
          }}
          tabIndex={0}
        >
          <div className="embla-viewport" ref={viewportRef}>
            <div className="embla-container">
              {features.map((feature, index) => (
                <div
                  className="embla-slide feature-slide"
                  key={feature.title}
                  role="group"
                  aria-roledescription={t("слайд")}
                  aria-label={t("{current} из {total}", { current: index + 1, total: features.length })}
                >
                  <FeatureCard feature={feature} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="carousel-footer">
          <div className="carousel-dots" aria-label={t("Выбор модуля")}>
            {Array.from({ length: snapCount }, (_, index) => (
              <button
                key={index}
                className={cx("carousel-dot", index === selectedIndex && "active")}
                type="button"
                aria-label={t("Перейти к модулю {number}", { number: index + 1 })}
                aria-current={index === selectedIndex ? "true" : undefined}
                onClick={() => stopAnd(() => api?.scrollTo(index, Boolean(reduceMotion)))}
              />
            ))}
          </div>
          <p className="carousel-instruction">
            {interactionStopped ? t("Автопрокрутка остановлена после взаимодействия") : t("Листайте, используйте стрелки или клавиши ← →")}
          </p>
        </div>
      </div>
    </section>
  );
}
