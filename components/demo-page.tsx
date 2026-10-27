import { Header } from "@/components/layout/header";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { createTranslator, localeHref, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { withBasePath } from "@/lib/site-url";

export const demoMetadata = {
  path: "/demo/",
  title: "Интерактивное демо RemCard",
  description: "Попробуйте назначения врача, отметки медсестры, витальные функции и баланс жидкости на учебной карте RemCard.",
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
          <a className="button button-secondary" href={demoUrl} target="_blank" rel="noreferrer">{t("Открыть демо в отдельной вкладке")} ↗</a>
        </div>
        <aside className="demo-limitations-note" aria-label={t("Об ограничениях демо")}>
          <strong>{t("Демонстрационная версия · часть возможностей отключена")}</strong>
          <p>{t("Демо повторяет основные экраны текущей программы, но реализует лишь часть возможностей. Некоторые разделы отключены, а поведение может отличаться от полной версии. Все пациенты и события вымышлены; изменения сохраняются только в вашем браузере.")}</p>
        </aside>
        <iframe id="demo-frame" className="demo-frame" src={demoUrl} title={t("Учебная реанимационная карта RemCard")} allow="fullscreen" allowFullScreen />
        <div className="demo-page-help">
          <p>{t("Начните с назначения: введите препарат, затем откройте «Роли» и выберите медсестру. Левый клик отмечает выполнение, правый — невыполнение. Повторный клик снимает отметку.")}</p>
          <LanguageSwitcher />
        </div>
      </main>
    </>
  );
}
