import { Header } from "@/components/layout/header";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { createTranslator, localeHref, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { withBasePath } from "@/lib/site-url";

export const demoMetadata = {
  path: "/demo/",
  title: "Интерактивное демо RemCard",
  description: "Браузерное демо RemCard для ПК: назначения врача, отметки медсестры, витальные функции и баланс жидкости на учебной карте.",
};

export default async function DemoPage({ locale }: { locale: Locale }) {
  const t = createTranslator(await getMessages(locale));
  const demoUrl = `${withBasePath("/demo-app/index.html")}?lang=${locale}`;
  const homeUrl = localeHref(withBasePath("/"), locale, process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return (
    <>
      <a className="skip-link" href="#demo-frame">{t("Перейти к демо")}</a>
      <Header />
      <main className="demo-page" id="main-content">
        <div className="demo-page-heading">
          <div>
            <a className="demo-home-link" href={homeUrl}>← {t("На главную")}</a>
            <h1>{t(demoMetadata.title)}</h1>
            <p>{t("Врач назначает — медсестра отмечает выполнение — общая карта обновляется.")}</p>
          </div>
          <a className="button button-secondary demo-open-link" href={demoUrl} target="_blank" rel="noreferrer">{t("Открыть демо в отдельной вкладке")} ↗</a>
        </div>
        <aside className="demo-limitations-note" aria-label={t("Об ограничениях демо")}>
          <strong>{t("Демо для компьютера")}</strong>
          <p>{t("Браузерное демо рассчитано на ПК с мышью и большим экраном. На телефоне интерфейс не адаптирован.")}</p>
        </aside>
        <aside className="demo-limitations-note" aria-label={t("Демонстрационная версия · часть возможностей отключена")}>
          <strong>{t("Демонстрационная версия · часть возможностей отключена")}</strong>
          <p>{t("Демо повторяет основные экраны текущей программы, но реализует лишь часть возможностей. Некоторые разделы отключены, а поведение может отличаться от полной версии. Все пациенты и события вымышлены; изменения сохраняются только в вашем браузере.")}</p>
        </aside>
        <section className="demo-mobile-notice" aria-labelledby="demo-desktop-title">
          <h2 id="demo-desktop-title">{t("Откройте эту страницу на ПК")}</h2>
          <p>{t("Демо повторяет настольную карту пациента и рассчитано на большой экран и управление мышью. Откройте эту же ссылку на компьютере; рекомендуемая ширина окна — от 1280 пикселей.")}</p>
          <a className="button button-secondary" href={homeUrl}>{t("Вернуться на главную")}</a>
        </section>
        <iframe id="demo-frame" className="demo-frame" src={demoUrl} title={t("Учебная реанимационная карта RemCard")} allow="fullscreen" allowFullScreen />
        <div className="demo-page-help">
          <p>{t("Начните с назначения: введите препарат, затем откройте «Роли» и выберите медсестру. Левый клик отмечает выполнение, правый — невыполнение. Повторный клик снимает отметку.")}</p>
          <LanguageSwitcher />
        </div>
      </main>
    </>
  );
}
