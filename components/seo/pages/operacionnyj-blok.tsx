import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { PROJECT_LINKS } from "@/lib/links";
import { resolveSiteUrl, withBasePath } from "@/lib/site-url";

const path = "/operacionnyj-blok/";

export const metadata: Metadata = {
  title: "Программа для операционного блока — RemCard ICU",
  description: "RemCard ICU объединяет регистрацию операции, состояние пациента, назначения, процедуры и завершение случая в одном Windows-приложении.",
  alternates: { canonical: new URL(path.replace(/^\//, ""), resolveSiteUrl()).toString() },
  openGraph: { title: "Программа для операционного блока — RemCard ICU", description: "Локальный рабочий контур RemCard ICU для регистрации и сопровождения операций." },
};

export default function Page() {
  return <SeoLandingPage
    eyebrow="Операционный блок"
    title="Регистрация и сопровождение операции в RemCard ICU"
    description="Отдельный рабочий сценарий RemCard ICU связывает операционную запись с данными пациента, назначениями, процедурами и последующим завершением случая."
    intro="Операционный блок использует связанную историю пациента, но получает собственные инструменты и этапы работы — от регистрации операции до её завершения."
    benefits={["Регистрация плановой и экстренной операции", "Связь с пациентом и размещением", "Фиксация состояния и назначений", "Процедуры и исследования в общей истории", "Завершение операции и передача случая", "Доступ к исходному коду и документации"]}
    sections={[
      { title: "До операции", text: "Сценарий начинается с регистрации пациента и операции, чтобы команда видела контекст случая до выполнения вмешательства." },
      { title: "Во время работы", text: "Процедуры, исследования и связанные записи остаются частью общей истории, а не отдельными разрозненными файлами." },
      { title: "После завершения", text: "Операция завершается в рамках общего жизненного цикла пациента и может перейти к дальнейшему наблюдению или архиву." },
    ]}
    related={[
      { label: "Программа для ОРИТ", href: withBasePath("/programma-dlya-orit/") },
      { label: "Электронная реанимационная карта", href: withBasePath("/elektronnaya-reanimacionnaya-karta/") },
      { label: "Документация и codemap", href: PROJECT_LINKS.documentation },
    ]}
  />;
}
