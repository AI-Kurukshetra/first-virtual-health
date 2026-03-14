import type { MaintenanceScheduleBlock } from "@/lib/types/cmms";
import { formatUTCDate } from "@/lib/utils/formatters";

interface Props {
  events: MaintenanceScheduleBlock[];
}

const badgeByType: Record<
  MaintenanceScheduleBlock["type"],
  { label: string; className: string }
> = {
  preventive: { label: "Preventive", className: "bg-indigo-500/15 text-indigo-600" },
  inspection: { label: "Inspection", className: "bg-emerald-500/15 text-emerald-600" },
  calibration: { label: "Calibration", className: "bg-amber-500/15 text-amber-600" },
};

export const ScheduleBoard = ({ events }: Props) => (
  <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/70">
    <header className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Upcoming maintenance
      </h2>
      <span className="text-xs uppercase tracking-wide text-zinc-500">
        {events.length} scheduled
      </span>
    </header>
    <ul className="mt-4 space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex flex-col rounded-2xl border border-zinc-200/70 p-4 text-sm dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {formatUTCDate(event.start)}
              </p>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-xs text-zinc-500">
                Team {event.team} · Asset {event.assetId}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeByType[event.type].className}`}
            >
              {badgeByType[event.type].label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
