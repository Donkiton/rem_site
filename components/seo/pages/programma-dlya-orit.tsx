import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { PROJECT_LINKS } from "@/lib/links";
import { resolveSiteUrl, withBasePath } from "@/lib/site-url";

const path = "/programma-dlya-orit/";

export const metadata: Metadata = {
  title: "Программа для ОРИТ — RemCard ICU",
  description: "RemCard ICU — локальная Windows-программа для отделения реанимации и интенсивной терапии: пациенты, назначения, наблюдение, процедуры и архив.",
  alternates: { canonical: new URL(path.replace(/^\//, ""), resolveSiteUrl()).toString() },
  openGraph: { title: "Программа для ОРИТ — RemCard ICU", description: "Рабочий контур для врача и медицинской сестры в отделении реанимации и интенсивной терапии." },
};

export default function Page() {
  return <SeoLandingPage
    eyebrow="Программа для ОРИТ"
    title="Рабочий контур отделения реанимации и интенсивной терапии"
    description="RemCard ICU помогает связать повседневные действия врача и медсестры вокруг одной истории пациента — от поступления до перевода или архива."
    intro="Проект ориентирован на локальную работу организации: данные размещаются в выбранной папке, а доступ к общей базе и резервным копиям проверяется отдельно."
    benefits={["Список пациентов и размещение по койкам", "Назначения и контроль их выполнения", "Мониторинг состояния в динамике", "Инфузии, ИВЛ, процедуры и исследования", "Документы, завершение случая и архив", "Понятный стек Python, Qt и SQLite"]}
    sections={[
      { title: "Единая история", text: "Ключевые записи пациента находятся в одном приложении, чтобы участники смены видели общую актуальную картину." },
      { title: "Разделение ролей", text: "Интерфейсы врача, медсестры и операционного блока разделены по задачам, а не вынесены в несвязанные продукты." },
      { title: "Проверяемая основа", text: "Исходный код, тесты, сборка Windows и история изменений доступны в репозитории проекта." },
    ]}
    related={[
      { label: "Электронная реанимационная карта", href: withBasePath("/elektronnaya-reanimacionnaya-karta/") },
      { label: "Программа для операционного блока", href: withBasePath("/operacionnyj-blok/") },
      { label: "Открыть репозиторий RemCard", href: PROJECT_LINKS.repository },
    ]}
  />;
}
