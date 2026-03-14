export const formatUTCDate = (value: string, locale = "en-US") =>
  new Date(value).toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatShortDate = (value: string, locale = "en-US") =>
  new Date(value).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });

export const formatCurrency = (value: number, locale = "en-US") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const percentageColor = (percent: number) => {
  if (percent >= 90) return "text-emerald-500";
  if (percent >= 75) return "text-amber-500";
  return "text-rose-500";
};
