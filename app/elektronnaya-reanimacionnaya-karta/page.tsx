import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { PROJECT_LINKS } from "@/lib/links";
import { resolveSiteUrl, withBasePath } from "@/lib/site-url";

const path = "/elektronnaya-reanimacionnaya-karta/";

export const metadata: Metadata = {
  title: "Электронная реанимационная карта — RemCard ICU",
  description: "RemCard ICU — экспериментальная электронная карта пациента для реанимации: назначения, витальные показатели, процедуры, инфузии и документы на Windows.",
  alternates: { canonical: new URL(path.replace(/^\//, ""), resolveSiteUrl()).toString() },
  openGraph: { title: "Электронная реанимационная карта — RemCard ICU", description: "Ведение пациента в реанимации в локальном Windows-приложении с доступным исходным кодом." },
};

export default function Page() {
  return <SeoLandingPage
    eyebrow="Электронная реанимационная карта"
    title="RemCard ICU: электронная карта пациента в реанимации"
    description="Настольное Windows-приложение для последовательной фиксации состояния пациента, назначений, мониторинга и процедур в отделении реанимации."
    intro="Один рабочий контур объединяет данные пациента, назначения врача, выполнение процедур, витальные показатели и документы, сохраняя понятное разделение ролей."
    benefits={["Первичная фиксация состояния и динамики", "Назначения врача и выполнение медсестрой", "Витальные показатели, инфузии и ИВЛ", "Процедуры, исследования и документы", "Перевод, выписка и архив пациента", "Работа в локальной сети организации"]}
    sections={[
      { title: "Для врача", text: "Назначения, оценка состояния, процедуры и контроль динамики собраны в рабочем месте врача." },
      { title: "Для медсестры", text: "Рабочее место помогает видеть актуальные назначения и отмечать их выполнение без дублирования записей." },
      { title: "Для организации", text: "Проект рассчитан на локальный Windows-контур с общей папкой данных и отдельной проверкой резервного копирования." },
    ]}
    related={[
      { label: "Программа для ОРИТ", href: withBasePath("/programma-dlya-orit/") },
      { label: "Возможности и интерфейс", href: withBasePath("/#features") },
      { label: "Исходный код RemCard ICU", href: PROJECT_LINKS.repository },
    ]}
  />;
}
