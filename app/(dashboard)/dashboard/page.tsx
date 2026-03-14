import { AssetGrid } from "@/components/dashboard/asset-grid";
import { InventoryPanel } from "@/components/dashboard/inventory-panel";
import { ScheduleBoard } from "@/components/dashboard/schedule-board";
import { StatCard } from "@/components/dashboard/stat-card";
import { VendorPanel } from "@/components/dashboard/vendor-panel";
import { WorkOrderTimeline } from "@/components/dashboard/work-order-timeline";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { ModuleRail } from "@/components/dashboard/module-rail";
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

const modules = [
  {
    name: "Command center",
    summary: "Facility KPIs, workload heatmap, live alerts.",
    stage: "live" as const,
    pinned: true,
  },
  {
    name: "Assets & meters",
    summary: "Hierarchy, QR scans, warranties, runtime feeds.",
    stage: "live" as const,
    pinned: true,
  },
  {
    name: "Work orders & PM",
    summary: "Intake, routing, SLA clocks, preventive plans.",
    stage: "live" as const,
    pinned: true,
  },
  {
    name: "Inventory & vendors",
    summary: "Stock, reorder points, supplier scorecards.",
    stage: "beta" as const,
    pinned: true,
  },
  {
    name: "Safety & compliance",
    summary: "Inspections, permits, audit-ready logs.",
    stage: "beta" as const,
  },
  {
    name: "IoT & predictive",
    summary: "Sensor ingestion, anomaly alerts, PdM models.",
    stage: "planned" as const,
  },
  {
    name: "Mobile & offline",
    summary: "Offline jobs, QR scans, AR assist on field.",
    stage: "beta" as const,
  },
  {
    name: "Analytics & reporting",
    summary: "MTTR/MTBF, maintenance mix, cost curves.",
    stage: "planned" as const,
  },
  {
    name: "Integrations & webhooks",
    summary: "ERP, calendar sync, API access, webhooks.",
    stage: "planned" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] dark:bg-black">
      <div className="flex w-full gap-4 px-3 py-5 lg:gap-6 lg:px-6">
        <ModuleRail modules={modules} />

        <div className="flex-1 space-y-8">
          <header className="space-y-3 rounded-3xl border border-zinc-200/60 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-indigo-500">
                  Command center
                </p>
                <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
                  Falcon Ridge Manufacturing
                </h1>
                <p className="text-sm text-zinc-500">
                  Monitoring 4 facilities | 312 assets | 58 technicians online
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/15 dark:text-white dark:hover:border-white/30">
                  Export report
                </button>
                <Link
                  href="/dashboard/requests"
                  className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/15 dark:text-white dark:hover:border-white/30"
                >
                  View requests
                </Link>
                <form action={logoutAction}>
                  <button className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600">
                    Logout
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
      </div>
    </div>
  );
}
