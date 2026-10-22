"use client";

import { createContext, useContext } from "react";
import { PROJECT_VERSION_FALLBACK } from "@/lib/project-version";

const ProjectVersionContext = createContext(PROJECT_VERSION_FALLBACK);

export function ProjectVersionProvider({
  initialVersion,
  children,
}: {
  initialVersion: string;
  children: React.ReactNode;
}) {
  return <ProjectVersionContext.Provider value={initialVersion}>{children}</ProjectVersionContext.Provider>;
}

export function ProjectVersionValue() {
  return <>{useContext(ProjectVersionContext)}</>;
}
