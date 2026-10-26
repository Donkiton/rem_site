"use client";

import { useI18n } from "@/components/i18n-provider";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Archive,
  BriefcaseMedical,
  ClipboardList,
  Droplets,
  FileText,
  FlaskConical,
  HeartPulse,
  MonitorCog,
  Scale,
  Settings,
  ShieldPlus,
  Stethoscope,
  Syringe,
  UserRound,
  Wind,
} from "lucide-react";
import type { Feature } from "@/content/features";
import type { RoleIconName } from "@/content/roles";
import { cx } from "@/lib/utils";

const featureIcons: Record<Feature["icon"], LucideIcon> = {
  patient: UserRound,
  activity: Activity,
  clipboard: ClipboardList,
  droplets: Droplets,
  scale: Scale,
  wind: Wind,
  stethoscope: Stethoscope,
  flask: FlaskConical,
  surgery: Syringe,
  file: FileText,
  archive: Archive,
  settings: Settings,
};

const roleIcons: Record<RoleIconName, LucideIcon> = {
  doctor: BriefcaseMedical,
  nurse: HeartPulse,
  operating: ShieldPlus,
  admin: MonitorCog,
};

export function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { t } = useI18n();
  const Icon = featureIcons[feature.icon];
  return (
    <article className={cx("feature-card", `feature-${feature.accent}`)}>
      <div className="feature-card-topline">
        <span className="feature-icon" aria-hidden="true">
          <Icon size={23} />
        </span>
        <span className="feature-number">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{t(feature.title)}</h3>
      <p>{t(feature.description)}</p>
      <div className="feature-preview" aria-label={t("Пример данных: {preview}", { preview: t(feature.preview) })}>
        <span className="feature-preview-dot" aria-hidden="true" />
        {t(feature.preview)}
      </div>
    </article>
  );
}

export function RoleCard({
  role,
}: {
  role: {
    title: string;
    icon: RoleIconName;
    description: string;
    items: readonly string[];
  };
}) {
  const { t } = useI18n();
  const Icon = roleIcons[role.icon];
  return (
    <article className="role-card">
      <span className="role-icon" aria-hidden="true">
        <Icon size={26} />
      </span>
      <h3>{t(role.title)}</h3>
      <p>{t(role.description)}</p>
      <ul>
        {role.items.map((item) => (
          <li key={item}>
            <span aria-hidden="true">✓</span>
            {t(item)}
          </li>
        ))}
      </ul>
    </article>
  );
}
