"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LayoutPanelTop, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { PrimaryButton, SecondaryButton, GhostButton } from "@/components/ui/buttons";
import { StatusBadge } from "@/components/ui/status-badge";
import { PROJECT_LINKS } from "@/lib/links";
import { GithubMark } from "@/components/icons/github-mark";
import { SCREENSHOT_VERSION, screenshots } from "@/content/screenshots";

const vitals = [
  { label: "ЧСС", value: "78", unit: "уд/мин", tone: "red" },
  { label: "SpO₂", value: "98", unit: "%", tone: "cyan" },
  { label: "АД", value: "118/72", unit: "мм рт. ст.", tone: "blue" },
  { label: "Темп.", value: "36,7", unit: "°C", tone: "green" },
] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 8,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 8,
    });
  };

  return (
    <section id="top" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid-background" aria-hidden="true" />
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <StatusBadge tone="success">Доступный исходный код · Windows · Активная разработка</StatusBadge>
          <h1 id="hero-title">RemCard ICU — электронная реанимационная карта</h1>
          <p className="hero-description">
            Приложение RemCard объединяет назначения, жизненно важные показатели, инфузионную терапию, ИВЛ,
            процедуры, лабораторные исследования, события операции и документы в едином рабочем
            пространстве.
          </p>
          <div className="hero-actions">
            <PrimaryButton href={PROJECT_LINKS.repository} external>
              <GithubMark width={18} height={18} aria-hidden="true" />
              Открыть проект на GitHub
            </PrimaryButton>
            <SecondaryButton href="#features">Посмотреть возможности</SecondaryButton>
            <GhostButton href="#interface">
              <LayoutPanelTop size={18} aria-hidden="true" />
              Изучить интерфейс
            </GhostButton>
          </div>
          <div className="hero-notes" aria-label="Ключевые особенности">
            <span>Локальная сеть</span>
            <span>SQLite</span>
            <span>Ролевые интерфейсы</span>
            <span>Source-available</span>
          </div>
        </div>

        <div
          className="hero-visual"
          ref={frameRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setOffset({ x: 0, y: 0 })}
        >
          <div
            className="hero-window-wrap"
            style={{ transform: reduceMotion ? undefined : `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
          >
            <div className="window-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
              <strong>RemCard · единый вход</strong>
            </div>
            <Image
              className="hero-screenshot"
              src={screenshots[0].src}
              alt={screenshots[0].alt}
              width={1920}
              height={1040}
              sizes="(max-width: 960px) 100vw, 58vw"
              priority
              unoptimized
            />
            <div className="hero-image-caption">
              <MousePointer2 size={15} aria-hidden="true" />
              Интерфейс {SCREENSHOT_VERSION} · выбор роли
            </div>
          </div>
          <div className="vitals-layer" aria-label="Пример жизненно важных показателей">
            {vitals.map((vital) => (
              <div className={`vital-mini vital-${vital.tone}`} key={vital.label}>
                <span>{vital.label}</span>
                <strong>{vital.value}</strong>
                <small>{vital.unit}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ecg-line" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0 42H310l18-8 12 8h55l11-12 16 12h38l9-20 17 38 18-56 22 38h78l10-8 15 8h237l12-7 10 7h80l14-15 19 15h67l10-23 15 40 17-61 23 44h168" />
        </svg>
      </div>
    </section>
  );
}
