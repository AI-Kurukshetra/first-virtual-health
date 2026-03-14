import Link from "next/link";
import { ensureAdminSession } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  new: "New",
  approved: "Approved",
  rejected: "Rejected",
};

export default async function AdminCommandCenter() {
  await ensureAdminSession();
  const supabase = getSupabaseServerClient();

  const { data: requests } = await supabase
    .from("workspace_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: waitlist } = await supabase
    .from("waitlist")
    .select("*")
    .order("inserted_at", { ascending: false })
    .limit(6);

  const totalRequests = requests?.length ?? 0;
  const newRequests =
    requests?.filter((request) => request.status === "new").length ?? 0;
  const approvedRequests =
    requests?.filter((request) => request.status === "approved").length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-indigo-500">
          Admin module
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">
          Smart asset & maintenance command center
        </h1>
        <p className="text-sm text-zinc-500">
          Monitor early access demand, waitlist velocity, and onboarding status.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Total requests
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
            {totalRequests}
          </p>
          <p className="text-xs text-zinc-500">
            {newRequests} new · {approvedRequests} approved
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Waitlist entries
          </p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
            {waitlist?.length ?? 0}
          </p>
          <p className="text-xs text-zinc-500">Latest 6 shown below.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Quick actions
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <Link
              href="/dashboard/requests"
              className="block rounded-full border border-zinc-200 px-4 py-2 font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white"
            >
              Manage workspace queue
            </Link>
            <Link
              href="/data-model"
              className="block rounded-full border border-zinc-200 px-4 py-2 font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:text-white"
            >
              Review SRS data model
            </Link>
          </div>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Workspace requests
          </h2>
          <Link
            href="/dashboard/requests"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
          >
            View full queue →
          </Link>
        </div>
        <div className="space-y-3">
          {!requests || requests.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200/80 px-4 py-6 text-center text-sm text-zinc-500 dark:border-white/15">
              No requests yet.
            </p>
          ) : (
            requests.slice(0, 4).map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-900/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-zinc-900 dark:text-white">
                      {request.company}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {request.full_name} · {request.email}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-zinc-500">
                    {statusLabels[request.status] ?? request.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-500">
                  Goal: {request.goal || "—"}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Waitlist spotlight
        </h2>
        <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-900/70">
          <div className="grid gap-4 sm:grid-cols-2">
            {waitlist?.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-zinc-200/70 p-4 text-sm dark:border-white/10"
              >
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {entry.email}
                </p>
                <p className="text-xs text-zinc-500">
                  {entry.use_case || "No context provided."}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-400">
                  Submitted {new Date(entry.inserted_at).toLocaleString()}
                </p>
              </article>
            )) ??
              "No waitlist entries."}
          </div>
        </div>
      </section>
    </div>
  );
}
