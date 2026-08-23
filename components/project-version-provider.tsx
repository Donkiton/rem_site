"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  normalizeProjectVersion,
  PROJECT_VERSION_FALLBACK,
  PROJECT_VERSION_URL,
} from "@/lib/project-version";

const ProjectVersionContext = createContext(PROJECT_VERSION_FALLBACK);

export function ProjectVersionProvider({
  initialVersion,
  children,
}: {
  initialVersion: string;
  children: React.ReactNode;
}) {
  const [version, setVersion] = useState(initialVersion);

  useEffect(() => {
    const controller = new AbortController();
    fetch(PROJECT_VERSION_URL, { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((value) => {
        const currentVersion = normalizeProjectVersion(value);
        if (currentVersion) setVersion(currentVersion);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return <ProjectVersionContext.Provider value={version}>{children}</ProjectVersionContext.Provider>;
}

export function ProjectVersionValue() {
  return <>{useContext(ProjectVersionContext)}</>;
}
