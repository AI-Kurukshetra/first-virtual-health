import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { ensureAdminSession } from "@/lib/auth/admin";
import { updateWorkspaceRequestStatus } from "@/app/actions/signup-request";

export const dynamic = "force-dynamic";

const statusOptions = ["new", "approved", "rejected"];
const statusStyles: Record<string, string> = {
  new: "bg-amber-500/15 text-amber-600",
  approved: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-rose-500/15 text-rose-600",
};

export default async function WorkspaceRequestsPage() {
  await ensureAdminSession();
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("workspace_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-indigo-500">
          Workspace requests
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
          Early access queue
        </h1>
        <p className="text-sm text-zinc-500">
          Review inbound pilot requests captured via the signup form.
        </p>
      </div>

        <div className="space-y-4">
        {!data || data.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200/80 px-4 py-6 text-center text-sm text-zinc-500 dark:border-white/15">
            No requests yet. Share the signup page with manufacturing prospects.
          </p>
        ) : (
          data.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {request.company}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {request.full_name} · {request.email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status] ?? "bg-zinc-200 text-zinc-700"}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-500 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide">Plants</p>
                  <p className="text-base font-semibold text-zinc-900 dark:text-white">
                    {request.plants ?? "N/A"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide">
                    Primary goal
                  </p>
                  <p className="text-base text-zinc-900 dark:text-white">
                    {request.goal || "—"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <form action={updateWorkspaceRequestStatus} className="flex flex-wrap items-center gap-3 text-sm">
                  <input type="hidden" name="requestId" value={request.id} />
                  <label className="text-xs uppercase tracking-wide text-zinc-500">
                    Update status
                  </label>
                  <select
                    name="status"
                    defaultValue={request.status}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-sm dark:border-white/10 dark:bg-zinc-950"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-full border border-zinc-200 px-4 py-1 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white">
                    Save
                  </button>
                </form>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Submitted {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
