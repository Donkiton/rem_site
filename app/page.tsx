import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { ComparisonSection } from "@/components/sections/comparison";
import { FAQAccordion } from "@/components/sections/faq-accordion";
import { FeatureCarousel } from "@/components/sections/feature-carousel";
import { Hero } from "@/components/sections/hero";
import { ScreenshotCarousel } from "@/components/sections/screenshot-carousel";
import {
  FinalCTASection,
  IntroSection,
  LocalNetworkSection,
  OpenSourceSection,
  RoadmapSection,
  RolesSection,
  SafetySection,
  StorySection,
  TechnologiesSection,
} from "@/components/sections/static-sections";
import { Timeline } from "@/components/sections/timeline";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getGitHubMetrics, getLatestGitHubRelease } from "@/lib/github";
import { PROJECT_LINKS } from "@/lib/links";
import { getProjectVersion } from "@/lib/project-version";
import { ProjectVersionProvider } from "@/components/project-version-provider";

export default async function Home() {
  const [metrics, release, projectVersion] = await Promise.all([
    getGitHubMetrics(),
    getLatestGitHubRelease(),
    getProjectVersion(),
  ]);
  const releaseUrl = release?.url ?? PROJECT_LINKS.releases;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RemCard ICU",
    alternateName: ["RemCard", "Рем Карта"],
    applicationCategory: "DesktopApplication",
    operatingSystem: "Windows",
    softwareVersion: projectVersion,
    description:
      "Экспериментальное приложение с доступным исходным кодом для процессов реанимации и операционного блока.",
    url: PROJECT_LINKS.repository,
    downloadUrl: release?.downloadUrl ?? releaseUrl,
    codeRepository: PROJECT_LINKS.repository,
    license: PROJECT_LINKS.license,
  };

  return (
    <ProjectVersionProvider initialVersion={projectVersion}>
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <Header />
      <main id="main-content">
        <Hero />
        <IntroSection />
        <ComparisonSection />
        <RolesSection />
        <FeatureCarousel />
        <ScreenshotCarousel />
        <Timeline />
        <ArchitectureDiagram />
        <LocalNetworkSection />
        <SafetySection />
        <TechnologiesSection />
        <OpenSourceSection metrics={metrics} release={release} />
        <StorySection />
        <RoadmapSection />
        <FAQAccordion />
        <FinalCTASection />
      </main>
      <Footer releaseUrl={releaseUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </ProjectVersionProvider>
  );
}
