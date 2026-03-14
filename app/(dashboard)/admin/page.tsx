import Link from "next/link";
import { ensureAdminSession } from "@/lib/auth/admin";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { logoutAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  new: "New",
  approved: "Approved",
  rejected: "Rejected",
};

export default async function AdminCommandCenter() {
  await ensureAdminSession();
  const supabase = getSupabaseServerClient();

  let authAdmins: any[] = [];
  try {
    const adminClient = getSupabaseAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 });
    authAdmins = data.users.filter(
      (u: any) =>
        u.user_metadata?.role === "admin" ||
        u.app_metadata?.role === "admin" ||
        u.email?.toLowerCase() === "admin@yourplant.com",
    );
  } catch (error) {
    console.warn("Failed to load auth admins", error);
  }

  const { data: requests } = await supabase
    .from("workspace_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: waitlist } = await supabase
    .from("waitlist")
    .select("*")
    .order("inserted_at", { ascending: false })
    .limit(6);

  const { data: adminUsers } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: cmmsUsers } = await supabase
    .from("cmms_users")
    .select("*")
    .order("created_at", { ascending: false });

  const totalRequests = requests?.length ?? 0;
  const newRequests =
    requests?.filter((request) => request.status === "new").length ?? 0;
  const approvedRequests =
    requests?.filter((request) => request.status === "approved").length ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f8fb] dark:bg-black">
      <div className="flex w-full gap-4 px-3 py-5 lg:gap-6 lg:px-6">
        <AdminSidebar />
        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-zinc-200/80 bg-gradient-to-r from-white to-zinc-50 p-4 shadow-sm dark:border-white/10 dark:from-zinc-900/70 dark:to-zinc-900/50">
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
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/15 dark:text-white dark:hover:border-white/30"
            >
              Back to dashboard
            </Link>
            <form action={logoutAction}>
              <button className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600">
                Logout
              </button>
            </form>
          </div>
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

      <section id="workspace-requests" className="space-y-3">
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

      <section id="waitlist" className="space-y-3">
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

            <section id="user-management" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            User management
          </h2>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Live from Supabase
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-zinc-200/80 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-indigo-500">Bulk actions</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Invite, reset passwords, or toggle status across users.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <button className="rounded-full bg-indigo-500 px-3 py-2 text-white shadow-sm hover:bg-indigo-600">
                Invite admin
              </button>
              <button className="rounded-full bg-emerald-500 px-3 py-2 text-white shadow-sm hover:bg-emerald-600">
                Invite CMMS user
              </button>
              <button className="rounded-full border border-zinc-300 px-3 py-2 text-zinc-700 hover:border-zinc-500 dark:border-white/20 dark:text-white dark:hover:border-white/40">
                Reset password
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl dark:border-white/10 dark:bg-zinc-900/80">
            <header className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:text-white">
              <span>Admin users (admin_users)</span>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                {adminUsers?.length ?? 0} total
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200/70 text-sm dark:divide-white/10">
                <thead className="bg-zinc-50/80 dark:bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                  {(adminUsers ?? []).map((user: any) => (
                    <tr key={user.id} className="hover:bg-indigo-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {user.role ?? "admin"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                          {user.status ?? "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/25">
                          Activate
                        </button>
                        <button className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-500/25">
                          Deactivate
                        </button>
                        <button className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 hover:border-zinc-400 dark:border-white/15 dark:text-white dark:hover:border-white/30">
                          Reset pass
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(adminUsers ?? []).length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        No admin users found. Seed the admin_users table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl dark:border-white/10 dark:bg-zinc-900/80">
            <header className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:text-white">
              <span>CMMS users (cmms_users)</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                {cmmsUsers?.length ?? 0} total
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200/70 text-sm dark:divide-white/10">
                <thead className="bg-zinc-50/80 dark:bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                  {(cmmsUsers ?? []).map((user: any) => (
                    <tr key={user.id} className="hover:bg-emerald-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {user.role ?? "technician"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-600">
                          {user.status ?? "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/25">
                          Activate
                        </button>
                        <button className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-500/25">
                          Deactivate
                        </button>
                        <button className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 hover:border-zinc-400 dark:border-white/15 dark:text-white dark:hover:border-white/30">
                          Reset pass
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(cmmsUsers ?? []).length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        No CMMS users found. Seed the cmms_users table.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-xl dark:border-white/10 dark:bg-zinc-900/80">
            <header className="flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 text-sm font-semibold text-zinc-700 dark:border-white/10 dark:text-white">
              <span>Admin users (Supabase Auth)</span>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                {authAdmins.length}
              </span>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200/70 text-sm dark:divide-white/10">
                <thead className="bg-zinc-50/80 dark:bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-300">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-white/10">
                  {authAdmins.map((user: any) => (
                    <tr key={user.id} className="hover:bg-indigo-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        {user.user_metadata?.role ?? user.app_metadata?.role ?? "admin"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {authAdmins.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        No admin auth users found. Use /admin/register to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            id="settings"
            className="rounded-3xl border border-dashed border-zinc-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-zinc-900/60"
          >
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-500">
                  Settings & actions
                </p>
                <p className="text-xs text-zinc-500">No-code admin ops</p>
              </div>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                Admin
              </span>
            </header>
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
                <p className="font-semibold text-zinc-900 dark:text-white">Reset user password</p>
                <p className="text-xs text-zinc-500">
                  Send reset link via Supabase Auth. Requires service role key.
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="email"
                    placeholder="user@plant.com"
                    className="flex-1 rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/40"
                  />
                  <button className="rounded-2xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white">
                    Send link
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-zinc-900/70">
                <p className="font-semibold text-zinc-900 dark:text-white">Activate/deactivate user</p>
                <p className="text-xs text-zinc-500">
                  Toggle status in cmms_users table (requires service role key).
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="email"
                    placeholder="user@plant.com"
                    className="flex-1 rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900/40"
                  />
                  <button className="rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white">
                    Activate
                  </button>
                  <button className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
              Note: buttons are illustrative; wire to Supabase Admin SDK when service role key is configured.
            </p>
          </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}

