import type { Asset } from "@/lib/types/cmms";
import { formatShortDate } from "@/lib/utils/formatters";

interface Props {
  assets: Asset[];
}

const statusStyles: Record<Asset["status"], string> = {
  online: "bg-emerald-500/15 text-emerald-500",
  maintenance: "bg-amber-500/15 text-amber-600",
  offline: "bg-rose-500/15 text-rose-500",
  degraded: "bg-blue-500/15 text-blue-500",
};

export const AssetGrid = ({ assets }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
    <header className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Critical assets
      </h2>
      <span className="text-xs uppercase tracking-wide text-zinc-500">
        {assets.length} monitored
      </span>
    </header>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {assets.map((asset) => (
        <article
          key={asset.id}
          className="rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-zinc-500">{asset.code}</p>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {asset.name}
              </h3>
              <p className="text-sm text-zinc-500">{asset.location}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[asset.status]}`}
            >
              {asset.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Uptime
              </p>
              <p className="text-lg font-semibold">{asset.uptimePercent}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Health
              </p>
              <p className="text-lg font-semibold">{asset.healthScore}/100</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-zinc-500">
            Next PM on {formatShortDate(asset.nextMaintenance)}
          </div>
        </article>
      ))}
    </div>
  </section>
);
