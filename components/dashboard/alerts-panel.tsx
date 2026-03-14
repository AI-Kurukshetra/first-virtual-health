import type { MaintenanceInsight, SafetyAlert } from "@/lib/types/cmms";
import { formatUTCDate } from "@/lib/utils/formatters";

interface Props {
  safety: SafetyAlert[];
  insights: MaintenanceInsight[];
}

const severityStyles = {
  info: "bg-blue-500/15 text-blue-500",
  warning: "bg-amber-500/15 text-amber-600",
  critical: "bg-rose-500/15 text-rose-600",
};

export const AlertsPanel = ({ safety, insights }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
      Alerts & insights
    </h2>
    <div className="mt-4 space-y-5">
      {safety.map((alert) => (
        <article
          key={alert.id}
          className="rounded-2xl border border-zinc-200/70 p-4 text-sm dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${severityStyles[alert.severity]}`}
            >
              {alert.severity}
            </span>
            <span className="text-xs text-zinc-500">
              {formatUTCDate(alert.createdAt)}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-white">
            {alert.headline}
          </h3>
          <p className="text-zinc-500">{alert.description}</p>
        </article>
      ))}
    </div>
    <div className="mt-6 space-y-4">
      {insights.map((insight) => (
        <article
          key={insight.id}
          className="rounded-2xl border border-dashed border-zinc-200/70 p-4 text-sm dark:border-white/20"
        >
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {insight.impact} impact
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-white">
            {insight.title}
          </h3>
          <p className="text-zinc-500">{insight.description}</p>
          <p className="mt-2 font-medium text-indigo-600 dark:text-indigo-300">
            Recommendation: {insight.recommendation}
          </p>
        </article>
      ))}
    </div>
  </section>
);
