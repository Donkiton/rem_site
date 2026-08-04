"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { PROJECT_LINKS } from "@/lib/links";
import { cx } from "@/lib/utils";
import { IconButton, PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { GithubMark } from "@/components/icons/github-mark";

const navigation = [
  { label: "Возможности", href: "#features", id: "features" },
  { label: "Интерфейс", href: "#interface", id: "interface" },
  { label: "Для кого", href: "#roles", id: "roles" },
  { label: "Как устроено", href: "#architecture", id: "architecture" },
  { label: "Open source", href: "#open-source", id: "open-source" },
  { label: "Документация", href: PROJECT_LINKS.documentation, external: true },
  { label: "FAQ", href: "#faq", id: "faq" },
] as const;

export function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(document.querySelectorAll<HTMLElement>("header, main, footer"));
    const previousInert = background.map((element) => element.inert);
    document.body.style.overflow = "hidden";
    background.forEach((element) => {
      element.inert = true;
    });

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const first = focusable()[0];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      previousFocus?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cx("mobile-navigation", open && "mobile-navigation-open")} aria-hidden={!open}>
      <button className="mobile-nav-backdrop" type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} />
      <div ref={panelRef} className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Навигация">
        <div className="mobile-nav-head">
          <a className="brand" href="#top" onClick={onClose}>
            <Image src="/remcardicon.png" alt="" width={36} height={36} unoptimized />
            <span>RemCard</span>
          </a>
          <IconButton aria-label="Закрыть меню" onClick={onClose}>
            <X aria-hidden="true" />
          </IconButton>
        </div>
        <nav aria-label="Мобильная навигация">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={"external" in item && item.external ? "_blank" : undefined}
              rel={"external" in item && item.external ? "noreferrer" : undefined}
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-nav-actions">
          <PrimaryButton href={PROJECT_LINKS.repository} external>
            <GithubMark width={17} height={17} aria-hidden="true" />
            Открыть GitHub
          </PrimaryButton>
          <SecondaryButton href="#interface" onClick={onClose}>
            Посмотреть интерфейс
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navigation
      .flatMap((item) => ("id" in item && item.id ? [document.getElementById(item.id)] : []))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={cx("site-header", scrolled && "site-header-scrolled")}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="RemCard — на главную">
            <Image src="/remcardicon.png" alt="" width={38} height={38} priority unoptimized />
            <span>RemCard</span>
          </a>
          <nav className="desktop-navigation" aria-label="Основная навигация">
            {navigation.map((item) => (
              <a
                key={item.label}
                className={cx("id" in item && item.id === activeId && "active")}
                href={item.href}
                target={"external" in item && item.external ? "_blank" : undefined}
                rel={"external" in item && item.external ? "noreferrer" : undefined}
                aria-current={"id" in item && item.id === activeId ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <SecondaryButton className="interface-header-button" href="#interface">
              Интерфейс
            </SecondaryButton>
            <PrimaryButton href={PROJECT_LINKS.repository} external>
              <GithubMark width={17} height={17} aria-hidden="true" />
              GitHub
            </PrimaryButton>
          </div>
          <IconButton className="mobile-menu-button" aria-label="Открыть меню" onClick={() => setMenuOpen(true)}>
            <Menu aria-hidden="true" />
          </IconButton>
        </div>
      </header>
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
