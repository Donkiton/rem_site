import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { GithubMark } from "@/components/icons/github-mark";
import { PROJECT_LINKS } from "@/lib/links";
import { withBasePath } from "@/lib/site-url";

export type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  benefits: readonly string[];
  sections: readonly { title: string; text: string }[];
  related: readonly { label: string; href: string }[];
};

export function SeoLandingPage({
  eyebrow,
  title,
  description,
  intro,
  benefits,
  sections,
  related,
}: SeoLandingPageProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <Header />
      <main id="main-content" className="seo-page">
        <section className="seo-hero section">
          <div className="site-container seo-hero-layout">
            <div className="seo-hero-copy">
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p className="seo-lead">{description}</p>
              <div className="hero-actions">
                <PrimaryButton href={PROJECT_LINKS.repository} external>
                  <GithubMark width={17} height={17} aria-hidden="true" /> Открыть RemCard ICU
                </PrimaryButton>
                <SecondaryButton href={withBasePath("/")}>Вернуться на сайт</SecondaryButton>
              </div>
            </div>
            <aside className="seo-summary" aria-label="Кратко о странице">
              <span className="seo-summary-icon" aria-hidden="true"><CheckCircle2 /></span>
              <p>{intro}</p>
            </aside>
          </div>
        </section>

        <section className="section seo-content-section" aria-labelledby="benefits-title">
          <div className="site-container">
            <div className="section-heading">
              <p className="eyebrow">Основные задачи</p>
              <h2 id="benefits-title">Что помогает делать RemCard ICU</h2>
            </div>
            <div className="seo-benefits-grid">
              {benefits.map((benefit) => (
                <article className="info-card" key={benefit}>
                  <span aria-hidden="true"><CheckCircle2 /></span>
                  <h3>{benefit}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section seo-content-section seo-content-alt" aria-labelledby="details-title">
          <div className="site-container">
            <div className="section-heading">
              <p className="eyebrow">Как это устроено</p>
              <h2 id="details-title">Рабочий контур проекта</h2>
            </div>
            <div className="seo-detail-grid">
              {sections.map((section) => (
                <article className="feature-card" key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </article>
              ))}
            </div>
            <div className="warning-panel seo-warning">
              <ShieldAlert aria-hidden="true" />
              <div>
                <h3>Важное ограничение</h3>
                <p>RemCard ICU — экспериментальный проект, не зарегистрированный как медицинское изделие. Перед реальной эксплуатацией необходимы независимые техническая и клиническая проверки.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section seo-related-section" aria-labelledby="related-title">
          <div className="site-container">
            <div className="section-heading">
              <p className="eyebrow">Дальше</p>
              <h2 id="related-title">Связанные страницы RemCard ICU</h2>
            </div>
            <div className="seo-related-links">
              {related.map((link) => (
                <a className="seo-related-link" key={link.href} href={link.href}>
                  <span>{link.label}</span><ArrowRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer releaseUrl={PROJECT_LINKS.releases} />
    </>
  );
}
