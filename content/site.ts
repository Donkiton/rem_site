export const patientJourney = [
  "Регистрация пациента",
  "Размещение по койке или регистрация операции",
  "Первичная фиксация состояния",
  "Назначения врача",
  "Выполнение назначений медсестрой",
  "Мониторинг динамики",
  "Процедуры и исследования",
  "Перевод, завершение операции, выписка или архив",
] as const;

export type TechnologyIconName =
  | "python"
  | "qt"
  | "sqlite"
  | "pytest"
  | "github"
  | "windows"
  | "package"
  | "code"
  | "license";

export const technologies = [
  { name: "Python 3.11", icon: "python" as TechnologyIconName, description: "Основная логика приложения" },
  { name: "PySide6", icon: "code" as TechnologyIconName, description: "Python-привязка для настольного интерфейса" },
  { name: "Qt", icon: "qt" as TechnologyIconName, description: "Компоненты настольного интерфейса" },
  { name: "SQLite", icon: "sqlite" as TechnologyIconName, description: "Хранение основных данных в выбранной папке" },
  { name: "PyInstaller", icon: "package" as TechnologyIconName, description: "Сборка Windows-версии" },
  { name: "pytest", icon: "pytest" as TechnologyIconName, description: "Автоматические тесты" },
  { name: "Windows", icon: "windows" as TechnologyIconName, description: "Основная проверяемая платформа" },
  { name: "GitHub", icon: "github" as TechnologyIconName, description: "Открытая разработка и история изменений" },
  { name: "MIT License", icon: "license" as TechnologyIconName, description: "Открытая лицензия исходного кода" },
] as const;
