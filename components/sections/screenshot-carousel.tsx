"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, Images } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { SCREENSHOT_VERSION, screenshots } from "@/content/screenshots";
import { IconButton } from "@/components/ui/buttons";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { cx } from "@/lib/utils";
import { ProjectVersionValue } from "@/components/project-version-provider";

const ScreenshotLightbox = dynamic(
  () => import("./screenshot-lightbox").then((module) => module.ScreenshotLightbox),
  { ssr: false },
);

export function ScreenshotCarousel() {
  const reduceMotion = useReducedMotion();
  const [viewportRef, api] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sync = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
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

  const goTo = useCallback(
    (index: number) => {
      setSelected(index);
      api?.scrollTo(index, Boolean(reduceMotion));
    },
    [api, reduceMotion],
  );

  return (
    <section id="interface" className="section gallery-section" aria-labelledby="gallery-title">
      <div className="site-container">
        <Reveal>
          <div className="section-heading-row gallery-heading-row">
            <SectionHeading
              id="gallery-title"
              eyebrow="Настоящий интерфейс"
              title="Посмотрите, как RemCard выглядит в работе"
              description={
                <>
                  Пять экранов показывают выбор роли, пациентов, койки, назначения и баланс жидкости.
                  Снимки интерфейса {SCREENSHOT_VERSION} сделаны на демонстрационных данных;
                  текущая версия проекта —{" "}
                  <ProjectVersionValue />.
                </>
              }
            />
            <div className="carousel-controls">
              <IconButton aria-label="Предыдущий экран" onClick={() => api?.scrollPrev(Boolean(reduceMotion))}>
                <ChevronLeft aria-hidden="true" />
              </IconButton>
              <IconButton aria-label="Следующий экран" onClick={() => api?.scrollNext(Boolean(reduceMotion))}>
                <ChevronRight aria-hidden="true" />
              </IconButton>
            </div>
          </div>
        </Reveal>

        <div
          className="screenshot-stage"
          role="region"
          aria-roledescription="карусель"
          aria-label="Галерея интерфейса RemCard"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") api?.scrollPrev(Boolean(reduceMotion));
            if (event.key === "ArrowRight") api?.scrollNext(Boolean(reduceMotion));
          }}
        >
          <div className="embla-viewport" ref={viewportRef}>
            <div className="embla-container">
              {screenshots.map((item, index) => (
                <div
                  className="embla-slide screenshot-slide"
                  key={item.src}
                  role="group"
                  aria-roledescription="слайд"
                  aria-label={`${index + 1} из ${screenshots.length}: ${item.title}`}
                  aria-hidden={index !== selected}
                  inert={index !== selected}
                >
                  <button
                    className="screenshot-image-button"
                    type="button"
                    tabIndex={index === selected ? 0 : -1}
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={1920}
                      height={1040}
                      sizes="(max-width: 900px) 100vw, 1180px"
                      loading={index === 0 ? "eager" : "lazy"}
                      unoptimized
                    />
                    <span className="expand-hint"><Expand size={17} aria-hidden="true" />На весь экран</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="screenshot-caption" aria-live="polite">
            <span className="screenshot-caption-icon" aria-hidden="true"><Images /></span>
            <div>
              <small>{String(selected + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}</small>
              <h3>{screenshots[selected].title}</h3>
              <p>{screenshots[selected].description}</p>
            </div>
          </div>
        </div>
        <div className="screenshot-thumbnails" role="group" aria-label="Выбрать экран">
          {screenshots.map((item, index) => (
            <button
              key={item.src}
              className={cx("screenshot-thumbnail", index === selected && "active")}
              type="button"
              aria-pressed={index === selected}
              onClick={() => goTo(index)}
            >
              <Image src={item.src} alt="" width={192} height={104} sizes="160px" unoptimized />
              <span>{item.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>
      {lightboxIndex !== null ? (
        <ScreenshotLightbox
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={(index) => {
            setLightboxIndex(index);
            goTo(index);
          }}
        />
      ) : null}
    </section>
  );
}
