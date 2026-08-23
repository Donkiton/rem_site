import { withBasePath } from "@/lib/site-url";

export const screenshots = [
  {
    title: "Отделение реанимации",
    shortTitle: "Отделение",
    src: withBasePath("/images/remcard/remcard-real-screenshot.png"),
    alt: "Главный экран RemCard со списком тестовых пациентов отделения реанимации",
    description:
      "Общий экран отделения: активные госпитализации, койки и быстрый переход к карте. На снимке используются только демонстрационные данные.",
  },
  {
    title: "Карта пациента и динамика",
    shortTitle: "Карта",
    src: withBasePath("/images/remcard/remcard-vitals-real-screenshot.png"),
    alt: "Карта тестового пациента с графиком жизненно важных показателей",
    description:
      "Вкладка витальных функций соединяет записи по времени и графики, чтобы динамику можно было оценить без переключения между журналами.",
  },
  {
    title: "Рабочее место врача",
    shortTitle: "Врач",
    src: withBasePath("/images/remcard/remcard-doctor-orders-screenshot.png"),
    alt: "Экран назначений врача RemCard с демонстрационными данными",
    description:
      "Врач формирует и уточняет назначения в контексте выбранного пациента, видит их состояние и готовит документы.",
  },
  {
    title: "Рабочее место медсестры",
    shortTitle: "Медсестра",
    src: withBasePath("/images/remcard/remcard-nurse-orders-screenshot.png"),
    alt: "Экран выполнения назначений медсестрой в RemCard",
    description:
      "Медсестра получает актуальный список назначений, отмечает выполнение и вносит данные сменного наблюдения.",
  },
  {
    title: "Экстренная операционная",
    shortTitle: "Оперблок",
    src: withBasePath("/images/remcard/remcard-emergency-operating-room-screenshot.png"),
    alt: "Экран экстренной операционной RemCard с тестовым случаем",
    description:
      "Отдельное рабочее место для этапов операции, анестезии, введения препаратов, событий и передачи пациента.",
  },
] as const;
