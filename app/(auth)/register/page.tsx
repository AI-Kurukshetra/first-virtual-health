import Image from "next/image";
import Link from "next/link";
import { CmmsRegisterCard } from "@/components/forms/cmms-register-card";

export default function CmmsRegisterPage() {
  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              CMMS user registration
            </div>
            <p className="text-sm text-white/60">
              Create a technician / planner / vendor account. Already have one?{" "}
              <Link href="/login" className="font-semibold text-emerald-300">
                Workspace login
              </Link>{" "}
              · Admins go to{" "}
              <Link href="/admin/login" className="font-semibold text-emerald-300">
                /admin/login
              </Link>
              .
            </p>
            <CmmsRegisterCard />
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1517248154875-4b5321b36be5?auto=format&fit=crop&w=1600&q=80"
            alt="Industrial team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-emerald-800/40" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              ← Back to overview
            </Link>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-200">
                Field-ready access
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Provision CMMS seats in seconds.
              </h1>
              <p className="text-white/70">
                Uses the service role key to create Supabase Auth credentials and activate the
                user in <code>cmms_users</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
