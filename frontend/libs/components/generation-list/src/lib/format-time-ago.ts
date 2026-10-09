// Compact relative-time formatter ("just now", "5 minutes ago", "2 months
// ago") for gallery list rows. Kept dependency-free — the apps have no date
// library, and this avoids pulling one in for a single label.

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

const pluralize = (
  value: number,
  unit: string,
  t: (source: string, params?: Record<string, string | number>) => string,
): string => {
  const localizedUnit = t(value === 1 ? unit : `${unit}s`);
  return t("{count} {unit} ago", { count: value, unit: localizedUnit });
};

export function formatTimeAgo(
  input: string | number | Date,
  t: (source: string, params?: Record<string, string | number>) => string = (
    source,
    params,
  ) => source.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    params?.[key] === undefined ? placeholder : String(params[key]),
  ),
): string {
  const date = input instanceof Date ? input : new Date(input);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (!Number.isFinite(seconds) || seconds < 0) return t("just now");
  if (seconds < 45) return t("just now");
  if (seconds < HOUR) return pluralize(Math.round(seconds / MINUTE), "minute", t);
  if (seconds < DAY) return pluralize(Math.round(seconds / HOUR), "hour", t);
  if (seconds < WEEK) return pluralize(Math.round(seconds / DAY), "day", t);
  if (seconds < MONTH) return pluralize(Math.round(seconds / WEEK), "week", t);
  if (seconds < YEAR) return pluralize(Math.round(seconds / MONTH), "month", t);
  return pluralize(Math.round(seconds / YEAR), "year", t);
}
