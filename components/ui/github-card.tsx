"use client";

import { useI18n } from "@/components/i18n-provider";

import { CircleDot, GitFork, Star } from "lucide-react";
import type { GitHubMetrics } from "@/lib/github";
import { PROJECT_LINKS } from "@/lib/links";
import { PrimaryButton } from "@/components/ui/buttons";
import { GithubMark } from "@/components/icons/github-mark";

export function GitHubCard({ metrics }: { metrics: GitHubMetrics }) {
  const { t, locale } = useI18n();
  const formatMetric = (value: number) => new Intl.NumberFormat(locale, { notation: "compact" }).format(value);
  return (
    <aside className="github-card" aria-label={t("Проект RemCard на GitHub")}>
      <div className="github-card-head">
        <span aria-hidden="true"><GithubMark /></span>
        <div><small>github.com/Donkiton</small><strong>rem_card</strong></div>
      </div>
      {metrics.available ? (
        <dl className="github-metrics">
          <div><dt><Star aria-hidden="true" />{t("Звёзды")}</dt><dd>{formatMetric(metrics.stars)}</dd></div>
          <div><dt><GitFork aria-hidden="true" />{t("Форки")}</dt><dd>{formatMetric(metrics.forks)}</dd></div>
          <div><dt><CircleDot aria-hidden="true" />{t("Открытые задачи")}</dt><dd>{formatMetric(metrics.openIssues)}</dd></div>
        </dl>
      ) : (
        <p className="github-fallback">{t("Проект развивается на GitHub")}</p>
      )}
      <PrimaryButton href={PROJECT_LINKS.repository} external>{t("Открыть репозиторий")}</PrimaryButton>
    </aside>
  );
}
