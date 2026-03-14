import type { WorkOrder } from "@/lib/types/cmms";
import { formatUTCDate } from "@/lib/utils/formatters";

interface Props {
  workOrders: WorkOrder[];
}

const statusColors: Record<WorkOrder["status"], string> = {
  "in-progress": "bg-amber-500",
  scheduled: "bg-blue-500",
  blocked: "bg-rose-500",
  completed: "bg-emerald-500",
};

export const WorkOrderTimeline = ({ workOrders }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Live work orders
        </h2>
        <p className="text-sm text-zinc-500">
          Prioritized by criticality and upcoming due dates.
        </p>
      </div>
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {workOrders.length} active
      </span>
    </header>
    <div className="mt-6 space-y-4">
      {workOrders.map((order) => (
        <article
          key={order.id}
          className="rounded-2xl border border-zinc-200/70 p-4 dark:border-white/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-zinc-500">{order.id}</p>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {order.title}
              </h3>
              <p className="text-sm text-zinc-500">
                {order.location} · Due {formatUTCDate(order.dueDate)}
              </p>
            </div>
            <span
              className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="rounded-full border border-zinc-200 px-2 py-0.5 dark:border-white/20">
              Priority: {order.priority}
            </span>
            <span>Requested by {order.requestedBy}</span>
            <span className="text-zinc-400">•</span>
            <span>Assignees: {order.assignedTo.join(", ")}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);
