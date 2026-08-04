export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatMetric(value: number) {
  return new Intl.NumberFormat("ru-RU", { notation: "compact" }).format(value);
}
