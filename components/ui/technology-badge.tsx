import type { SimpleIcon } from "simple-icons";
import { siGithub, siPython, siPytest, siQt, siSqlite } from "simple-icons";
import { BadgeCheck, Code2, PackageCheck, PanelsTopLeft } from "lucide-react";
import type { TechnologyIconName } from "@/content/site";

const brandIcons: Partial<Record<TechnologyIconName, SimpleIcon>> = {
  python: siPython,
  qt: siQt,
  sqlite: siSqlite,
  pytest: siPytest,
  github: siGithub,
};

function FallbackIcon({ name }: { name: TechnologyIconName }) {
  if (name === "windows") return <PanelsTopLeft aria-hidden="true" />;
  if (name === "package") return <PackageCheck aria-hidden="true" />;
  if (name === "license") return <BadgeCheck aria-hidden="true" />;
  return <Code2 aria-hidden="true" />;
}

export function TechnologyBadge({
  technology,
}: {
  technology: {
    name: string;
    icon: TechnologyIconName;
    description: string;
  };
}) {
  const icon = brandIcons[technology.icon];
  return (
    <div className="technology-badge">
      <span className="technology-icon" aria-hidden="true">
        {icon ? (
          <svg role="img" viewBox="0 0 24 24">
            <path d={icon.path} />
          </svg>
        ) : (
          <FallbackIcon name={technology.icon} />
        )}
      </span>
      <span>
        <strong>{technology.name}</strong>
        <small>{technology.description}</small>
      </span>
    </div>
  );
}
