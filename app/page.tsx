import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";

const coreFeatures = [
  {
    title: "Asset registry",
    detail:
      "Hierarchical model with QR codes, meters, documentation, and vendor lineage for every asset.",
  },
  {
    title: "Work order intelligence",
    detail:
      "Create, route, and close work backed by skills, geo, and shift-aware automations.",
  },
  {
    title: "Preventive scheduling",
    detail:
      "Calendar + meter based PM plans with Google/Outlook sync and offline-capable mobile workflows.",
  },
  {
    title: "Inventory + purchasing",
    detail:
      "Min/max thresholds, automated PO requests, and supplier scorecards tied directly to work orders.",
  },
];

const advancedFeatures = [
  "AI-powered predictive maintenance fed by IoT telemetry.",
  "Mobile AR assistance and barcode/QR scanning.",
  "Intelligent work order routing with skills + load balancing.",
  "Automated parts ordering and energy optimization suggestions.",
  "Open APIs + webhooks for ERP, MES, and analytics fabric.",
];

const dataModel = [
  "Assets & Meters",
  "WorkOrders & Procedures",
  "Inventory & PurchaseOrders",
  "Vendors & Contracts",
  "Locations & Teams",
  "ComplianceRecords & Documents",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <header className="grid gap-10 lg:grid-cols-[3fr,2fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
              Next-Gen CMMS | Manufacturing | March 2026 blueprint
            </p>
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              Smart asset & maintenance management platform built for
              mobile-first reliability teams.
            </h1>
            <p className="text-lg text-white/70">
              Digitize every maintenance workflow, trigger predictive work from
              sensor data, and orchestrate technicians across facilities with a
              single source of truth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Open live prototype
              </Link>
            <Link
              href="https://www.onupkeep.com"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white"
            >
              Benchmark (UpKeep)
            </Link>
            <Link
              href="/data-model"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white"
            >
              Data model & API
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white"
            >
              Request access
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white"
            >
              Login
            </Link>
          </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-wide text-white/60">
              MVP in focus
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>- Asset registry with QR scanning & document vault</li>
              <li>- Work order + preventive scheduling workflows</li>
              <li>- Inventory, vendor, and purchase order loops</li>
              <li>- Multi-location dashboards + notifications</li>
              <li>- Offline-ready mobile actions (React Native)</li>
            </ul>
            <p className="mt-4 text-xs text-white/60">
              Target: manufacturing SMBs with 50-500 assets, shipping as a
              Vercel + Supabase powered SaaS.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {coreFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-white/70">{feature.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[3fr,2fr]">
          <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-6">
            <h2 className="text-xl font-semibold">
              Differentiators beyond the table stakes
            </h2>
            <ul className="mt-4 space-y-3 text-white/70">
              {advancedFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-white/50">
              Roadmap also includes drone inspections, gamified engagement, and
              sustainability scoring to keep maintenance teams future-proof.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#0c0c0c] p-6">
            <h2 className="text-xl font-semibold">Data model anchors</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {dataModel.map((item) => (
                <li key={item} className="rounded-2xl border border-white/10 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-white/60">
              API surface: /auth, /assets, /work-orders, /inventory, /vendors,
              /reports, /sensors, /analytics, /mobile, /webhooks.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Prototype snapshots</h2>
            <p className="mt-2 text-white/70">
              Explore the `/dashboard` route to see our configurable CMMS
              control room with KPIs, live work orders, schedules, inventory,
              and vendor tiles inspired by the SRS above.
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/70">
              <p>Highlights</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Stat layer for uptime, preventive mix, and cost.</li>
                <li>Work order timeline with critical path visibility.</li>
                <li>Inventory signals + supplier scorecards.</li>
                <li>Alerts & AI insights ready for predictive modules.</li>
              </ul>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Early access waitlist</h2>
            <p className="mt-2 text-white/70">
              Drop your details and we will wire your workspace with Supabase
              tables for assets, work orders, and IoT signals.
            </p>
            <div className="mt-4">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
