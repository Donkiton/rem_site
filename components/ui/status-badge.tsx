import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "progress" | "planned" | "research" | "warning";
}) {
  return <span className={cx("status-badge", `status-${tone}`)}>{children}</span>;
}
