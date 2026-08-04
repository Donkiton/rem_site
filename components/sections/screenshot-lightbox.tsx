"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, ZoomIn, ZoomOut, X } from "lucide-react";
import { screenshots } from "@/content/screenshots";
import { IconButton } from "@/components/ui/buttons";
import { cx } from "@/lib/utils";

export function ScreenshotLightbox({
  index,
  onClose,
  onChange,
}: {
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const screenshot = screenshots[index];

  const navigate = useCallback((nextIndex: number) => {
    setZoomed(false);
    onChange(nextIndex);
  }, [onChange]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "header, footer, main > section:not(#interface), #interface > .site-container",
      ),
    );
    const previousInert = background.map((element) => element.inert);
    document.body.style.overflow = "hidden";
    background.forEach((element) => {
      element.inert = true;
    });
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") navigate((index - 1 + screenshots.length) % screenshots.length);
      if (event.key === "ArrowRight") navigate((index + 1) % screenshots.length);
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, backgroundIndex) => {
        element.inert = previousInert[backgroundIndex];
      });
      previous?.focus();
    };
  }, [index, navigate, onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
      <button className="lightbox-backdrop" type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div className="lightbox-panel" ref={panelRef}>
        <div className="lightbox-header">
          <div>
            <span>Экран {index + 1} из {screenshots.length}</span>
            <h2 id="lightbox-title">{screenshot.title}</h2>
          </div>
          <div className="lightbox-actions">
            <IconButton
              aria-label={zoomed ? "Уменьшить изображение" : "Увеличить изображение"}
              onClick={() => setZoomed((value) => !value)}
            >
              {zoomed ? <ZoomOut aria-hidden="true" /> : <ZoomIn aria-hidden="true" />}
            </IconButton>
            <button ref={closeRef} className="icon-button" type="button" aria-label="Закрыть" onClick={onClose}>
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={cx("lightbox-image-scroll", zoomed && "zoomed")}>
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            width={1920}
            height={1040}
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
        <p className="lightbox-description"><Search size={16} aria-hidden="true" />{screenshot.description}</p>
        <IconButton
          className="lightbox-arrow lightbox-arrow-left"
          aria-label="Предыдущий экран"
          onClick={() => navigate((index - 1 + screenshots.length) % screenshots.length)}
        >
          <ChevronLeft aria-hidden="true" />
        </IconButton>
        <IconButton
          className="lightbox-arrow lightbox-arrow-right"
          aria-label="Следующий экран"
          onClick={() => navigate((index + 1) % screenshots.length)}
        >
          <ChevronRight aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}
