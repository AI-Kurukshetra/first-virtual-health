import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "mdi:view-dashboard" },
  { label: "Workspace requests", href: "#workspace-requests", icon: "mdi:inbox-arrow-down" },
  { label: "Waitlist", href: "#waitlist", icon: "mdi:clock-outline" },
  { label: "User management", href: "#user-management", icon: "mdi:account-group" },
  { label: "Settings", href: "#settings", icon: "mdi:cog-outline" },
];

export function AdminSidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col gap-4 rounded-3xl bg-[#0f1115] p-5 text-white shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3 ring-1 ring-white/15">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-base font-bold text-white shadow-lg">
            AK
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Emmerich, Ks...</p>
            <p className="text-[11px] text-white/70">/agencies-2</p>
          </div>
          <div className="flex gap-2 text-lg text-white/80">
            <span>⚙️</span>
            <span>🔔</span>
            <span>🔒</span>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item, idx) => {
            const isActive = idx === 0; // mark dashboard as active for now
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isActive ? "bg-white/20" : "bg-white/10"
                  } text-base`}
                >
                  {item.icon === "mdi:view-dashboard" && "📊"}
                  {item.icon === "mdi:inbox-arrow-down" && "📥"}
                  {item.icon === "mdi:clock-outline" && "🕒"}
                  {item.icon === "mdi:account-group" && "👥"}
                  {item.icon === "mdi:cog-outline" && "⚙️"}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-wide text-white/60">Shortcuts</p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="rounded-full bg-pink-500 px-3 py-1 text-white shadow hover:bg-pink-400"
            >
              Ops dashboard
            </Link>
            <Link
              href="/admin/register"
              className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/15"
            >
              Add admin
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/15"
            >
              Add CMMS user
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
