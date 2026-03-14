import Image from "next/image";
import Link from "next/link";
import { LoginCard } from "@/components/forms/login-card";

const benefits = [
  "Offline mode caches last 24h of work orders per technician.",
  "Role-based scopes (Admin, Planner, Technician, Vendor) enforced via Supabase Auth.",
  "Multi-factor prompts for critical assets and contractor access.",
  "QR / barcode scan flows fast-track asset lookups on the mobile app.",
];

const identityMetrics = [
  { label: "Plants online", value: "12", helper: "Multi-location aware" },
  { label: "Technicians synced", value: "58", helper: "Mobile + web" },
  { label: "Vendors trusted", value: "23", helper: "With warranties" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020305] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80"
            alt="Manufacturing facility"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/60 to-emerald-800/40" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              ← Back to overview
            </Link>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
                Secure gateway
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Next-Gen CMMS access for maintenance leaders and field
                technicians.
              </h1>
              <p className="text-white/70">
                Mobile-first workflows, AI-driven alerts, and IoT orchestration
                for every plant.
              </p>
              <div className="rounded-3xl border border-white/20 bg-black/40 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-wide text-white/60">
                  Why authenticate?
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {identityMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/20 bg-black/40 p-4 text-center backdrop-blur"
                >
                  <p className="text-3xl font-semibold">{metric.value}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {metric.label}
                  </p>
                  <p className="text-xs text-white/50">{metric.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              CMMS Login
            </div>
            <p className="text-sm text-white/60">
              Use corporate credentials or SSO. Need an account?{" "}
              <Link href="/signup" className="font-semibold text-emerald-300">
                Create one
              </Link>
              .
            </p>
            <LoginCard />
            <p className="text-xs text-white/60">
              Reviewing requirements?{" "}
              <Link href="/data-model" className="font-semibold text-emerald-300">
                Inspect the data model
              </Link>{" "}
              to see how assets, work orders, and predictive signals connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
