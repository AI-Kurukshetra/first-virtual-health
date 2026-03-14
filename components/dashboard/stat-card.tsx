import type { KpiMetric } from "@/lib/types/cmms";

interface StatCardProps {
  metric: KpiMetric;
}

export const StatCard = ({ metric }: StatCardProps) => {
  const trendColor =
    metric.trend >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  const trendLabel = `${metric.trend >= 0 ? "+" : ""}${metric.trend}%`;

  return (
    <article className="rounded-2xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {metric.label}
      </p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-3xl font-semibold text-zinc-900 dark:text-white">
          {metric.value}
        </span>
        <span className={`text-sm font-medium ${trendColor}`}>
          {trendLabel}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{metric.helperText}</p>
    </article>
  );
};
