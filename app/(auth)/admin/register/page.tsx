import Image from "next/image";
import Link from "next/link";
import { AdminRegisterCard } from "@/components/forms/admin-register-card";

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Admin registration
            </div>
            <p className="text-sm text-white/60">
              Creates an admin auth account and an active entry in <code>admin_users</code>. Already
              have one?{" "}
              <Link href="/admin/login" className="font-semibold text-indigo-300">
                Admin login
              </Link>
              .
            </p>
            <AdminRegisterCard />
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
            alt="Admin console"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/60 to-indigo-800/40" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              ← Back to overview
            </Link>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-indigo-200">
                Elevated access
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Provision CMMS admins securely.
              </h1>
              <p className="text-white/70">
                Protected by <code>ADMIN_REGISTRATION_CODE</code> (or fallback to
                <code> CMMS_REGISTRATION_CODE</code>).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
