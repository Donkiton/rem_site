import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

export function WarningPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="warning-panel" aria-label={title}>
      <span className="warning-icon" aria-hidden="true">
        <TriangleAlert size={24} />
      </span>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </aside>
  );
}
