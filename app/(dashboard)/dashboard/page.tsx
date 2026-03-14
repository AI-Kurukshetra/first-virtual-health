import { AssetGrid } from "@/components/dashboard/asset-grid";
import { InventoryPanel } from "@/components/dashboard/inventory-panel";
import { ScheduleBoard } from "@/components/dashboard/schedule-board";
import { StatCard } from "@/components/dashboard/stat-card";
import { VendorPanel } from "@/components/dashboard/vendor-panel";
import { WorkOrderTimeline } from "@/components/dashboard/work-order-timeline";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import {
  assets,
  inventory,
  kpis,
  schedules,
  safetyAlerts,
  vendors,
  workOrders,
  insights,
} from "@/lib/data/mock";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-indigo-500">
          Command center
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
              Falcon Ridge Manufacturing
            </h1>
            <p className="text-sm text-zinc-500">
              Monitoring 4 facilities | 312 assets | 58 technicians online
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white">
              Export report
            </button>
            <Link
              href="/dashboard/requests"
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white"
            >
              View requests
            </Link>
            <form action={logoutAction}>
              <button className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <WorkOrderTimeline workOrders={workOrders} />
          <AssetGrid assets={assets} />
          <ScheduleBoard events={schedules} />
        </div>
        <div className="space-y-8">
          <InventoryPanel items={inventory} />
          <AlertsPanel safety={safetyAlerts} insights={insights} />
          <VendorPanel vendors={vendors} />
        </div>
      </section>
    </div>
  );
}
