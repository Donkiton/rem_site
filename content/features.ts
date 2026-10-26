export type FeatureIconName =
  | "patient"
  | "activity"
  | "clipboard"
  | "droplets"
  | "scale"
  | "wind"
  | "stethoscope"
  | "flask"
  | "surgery"
  | "file"
  | "archive"
  | "settings";

export type Feature = {
  title: string;
  description: string;
  icon: FeatureIconName;
  preview: string;
  accent: "blue" | "cyan" | "violet" | "green";
};

export const features: Feature[] = [
  {
    title: "Карта пациента",
    description:
      "Состояние, история пребывания и ключевые данные пациента собраны в одной карте по сменам.",
    icon: "patient",
    preview: "Смена · койка · динамика",
    accent: "blue",
  },
  {
    title: "Витальные показатели",
    description:
      "ЧСС, давление, сатурация, температура и другие параметры отображаются в таблице и на графиках.",
    icon: "activity",
    preview: "Графики по времени",
    accent: "cyan",
  },
  {
    title: "Назначения",
    description:
      "Врач формирует назначения, а медсестра видит актуальный список и отмечает выполнение.",
    icon: "clipboard",
    preview: "План · статус · выполнение",
    accent: "violet",
  },
  {
    title: "Инфузионная терапия",
    description:
      "Растворы, дозировки, интервалы и фактическое выполнение фиксируются в общей карте.",
    icon: "droplets",
    preview: "Раствор · объём · скорость",
    accent: "cyan",
  },
  {
    title: "Питание и баланс жидкости",
    description:
      "Врач задаёт план питания, медсестра отмечает фактическое потребление. Введение и потери жидкости учитываются по сменам.",
    icon: "scale",
    preview: "Поступило ↔ выделено",
    accent: "green",
  },
  {
    title: "ИВЛ и кислородотерапия",
    description:
      "Параметры респираторной поддержки и их изменения сохраняются рядом с остальными показателями.",
    icon: "wind",
    preview: "Режим · FiO₂ · параметры",
    accent: "blue",
  },
  {
    title: "Процедуры",
    description:
      "Процедуры, этапы и связанные записи доступны в контексте конкретного пациента.",
    icon: "stethoscope",
    preview: "Шаблон · выполнение · печать",
    accent: "violet",
  },
  {
    title: "Лабораторные исследования",
    description:
      "Назначения исследований и результаты прошлых периодов помогают видеть клиническую картину целиком.",
    icon: "flask",
    preview: "Назначено · получено",
    accent: "green",
  },
  {
    title: "Операционный блок",
    description:
      "Плановые и экстренные случаи, этапы анестезии, препараты и события операции ведутся отдельно.",
    icon: "surgery",
    preview: "Случай · этапы · передача",
    accent: "cyan",
  },
  {
    title: "Документы и отчёты",
    description:
      "Печатные формы и отчёты формируются из данных, которые уже были внесены в рабочем процессе.",
    icon: "file",
    preview: "PDF · HTML · печать",
    accent: "blue",
  },
  {
    title: "Единый центр архива",
    description:
      "Архив пациентов, статистика и графические отчёты объединены в одном центре для разных рабочих ролей.",
    icon: "archive",
    preview: "Поиск · статистика · отчёты",
    accent: "violet",
  },
  {
    title: "Справочники и настройки",
    description:
      "Общие справочники, темы, пути данных и служебные параметры настраиваются в отдельном контуре.",
    icon: "settings",
    preview: "Справочники · база · backup",
    accent: "green",
  },
];
