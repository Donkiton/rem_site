import { CircleDot, GitFork, Star } from "lucide-react";
import type { GitHubMetrics } from "@/lib/github";
import { PROJECT_LINKS } from "@/lib/links";
import { formatMetric } from "@/lib/utils";
import { PrimaryButton } from "@/components/ui/buttons";
import { GithubMark } from "@/components/icons/github-mark";

export function GitHubCard({ metrics }: { metrics: GitHubMetrics }) {
  return (
    <aside className="github-card" aria-label="Проект RemCard на GitHub">
      <div className="github-card-head">
        <span aria-hidden="true"><GithubMark /></span>
        <div><small>github.com/Donkiton</small><strong>rem_card</strong></div>
      </div>
      {metrics.available ? (
        <dl className="github-metrics">
          <div><dt><Star aria-hidden="true" />Звёзды</dt><dd>{formatMetric(metrics.stars)}</dd></div>
          <div><dt><GitFork aria-hidden="true" />Форки</dt><dd>{formatMetric(metrics.forks)}</dd></div>
          <div><dt><CircleDot aria-hidden="true" />Открытые задачи</dt><dd>{formatMetric(metrics.openIssues)}</dd></div>
        </dl>
      ) : (
        <p className="github-fallback">Проект развивается на GitHub</p>
      )}
      <PrimaryButton href={PROJECT_LINKS.repository} external>Открыть репозиторий</PrimaryButton>
    </aside>
  );
}
