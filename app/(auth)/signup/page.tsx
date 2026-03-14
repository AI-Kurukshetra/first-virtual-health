import Image from "next/image";
import Link from "next/link";
import { SignupCard } from "@/components/forms/signup-card";

const highlights = [
  "Asset registry with QR scanning & IoT meters in under 48 hours.",
  "Predictive work routing that balances shift load and technician skills.",
  "Inventory + purchasing loop with automated vendor scoring.",
  "Offline-ready mobile experience and AR-guided procedures.",
];

const badges = [
  { label: "AI insights", value: "247 intent signals/week" },
  { label: "Work orders", value: "182 closed this sprint" },
  { label: "Asset uptime", value: "97.4% across 4 plants" },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#010203] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Join the pilot
            </div>
            <p className="text-sm text-white/60">
              Already verified?{" "}
              <Link href="/login" className="font-semibold text-sky-300">
                Sign in
              </Link>
              .
            </p>
            <SignupCard />
            <p className="text-xs text-white/60">
              Need to review architecture before onboarding?{" "}
              <Link href="/data-model" className="font-semibold text-sky-300">
                Explore the schema blueprint
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="relative hidden overflow-hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1457530378978-8bac673b8062?auto=format&fit=crop&w=1600&q=80"
            alt="Industrial maintenance visuals"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tl from-black via-black/60 to-sky-900/40" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.3em] text-white/60"
            >
              ← Back to overview
            </Link>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-sky-300">
                Why join?
              </p>
              <h1 className="text-4xl font-semibold leading-tight">
                Deploy the smart asset & maintenance platform outlined in the SRS.
              </h1>
              <p className="text-white/70">
                We co-build with your maintenance team, connect Supabase data, and ship AI-powered reliability in weeks.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {badges.map((badge) => (
                <div
                  key={badge.label}
                  className="rounded-3xl border border-white/20 bg-black/40 p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    {badge.label}
                  </p>
                  <p className="text-lg font-semibold">{badge.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
