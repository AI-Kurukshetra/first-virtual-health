import Image from "next/image";
import Link from "next/link";
import { AdminLoginCard } from "@/components/forms/admin-login-card";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0c0d10] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1503389152951-9f343605f61e?auto=format&fit=crop&w=1600&q=80"
            alt="Control room"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-indigo-800/40" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              ← Back to overview
            </Link>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-200">
                Admin console access
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Secure entry for CMMS admins & approvers.
              </h1>
              <p className="text-white/70">
                Manage users, workspace requests, and platform controls.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Admin login
            </div>
            <p className="text-sm text-white/60">
              Restricted to emails listed in <code>admin_users</code> (status: active).
            </p>
            <AdminLoginCard />
            <p className="text-xs text-white/60">
              Not an admin? Use{" "}
              <Link href="/login" className="font-semibold text-indigo-300">
                workspace login
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
