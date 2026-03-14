interface Module {
  name: string;
  summary: string;
  stage: "live" | "beta" | "planned";
  pinned?: boolean;
}

interface Props {
  modules: Module[];
}

const stageBadge: Record<Module["stage"], string> = {
  live: "bg-emerald-500/20 text-emerald-100",
  beta: "bg-indigo-500/20 text-indigo-100",
  planned: "bg-amber-500/20 text-amber-100",
};

const iconFor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("command")) return "📊";
  if (n.includes("asset")) return "🏭";
  if (n.includes("work")) return "🛠️";
  if (n.includes("inventory")) return "📦";
  if (n.includes("safety")) return "🛡️";
  if (n.includes("iot")) return "📡";
  if (n.includes("mobile")) return "📱";
  if (n.includes("analytics") || n.includes("report")) return "📈";
  if (n.includes("integration") || n.includes("webhook")) return "🔗";
  return "📁";
};

export function ModuleRail({ modules }: Props) {
  const pinned = modules.filter((m) => m.pinned);
  const rest = modules.filter((m) => !m.pinned);

  const pill = (module: Module, active?: boolean) => (
    <div
      key={module.name}
      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg shadow-pink-500/30"
          : "text-white/80 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${
            active ? "bg-white/20" : "bg-white/10"
          }`}
        >
          {iconFor(module.name)}
        </span>
        <div>
          <p className="leading-tight">{module.name}</p>
          <p className="text-[11px] font-normal text-white/60">{module.summary}</p>
        </div>
      </div>
      <span
        className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${stageBadge[module.stage]}`}
      >
        {module.stage}
      </span>
    </div>
  );

  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div className="sticky top-2 flex min-h-[96vh] flex-col gap-4 rounded-3xl bg-[#0f1115] p-4 text-white shadow-[0_15px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
        <section className="space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-pink-300">Pinned</p>
          <div className="space-y-2">
            {pinned.map((m, i) => pill(m, i === 0))}
            {pinned.length === 0 && (
              <p className="text-xs text-white/60">No pinned modules.</p>
            )}
          </div>
        </section>

        <div className="h-px w-full bg-white/10" />

        <section className="space-y-2">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/60">
            <span>More modules</span>
            <span>Roadmap</span>
          </div>
          <div className="space-y-2">
            {rest.map((m) => pill(m, false))}
            {rest.length === 0 && (
              <p className="text-xs text-white/60">No additional modules.</p>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
