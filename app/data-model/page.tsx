const entityGroups = [
  {
    title: "Operational Backbone",
    description:
      "Entities that represent people, assets, and the organizations coordinating maintenance.",
    items: [
      {
        name: "Users",
        detail:
          "Maintenance managers, technicians, vendors, and admins with role-based permissions.",
      },
      {
        name: "Teams",
        detail:
          "Logical groupings of technicians or engineers with skills, time zones, and shifts.",
      },
      {
        name: "Organizations",
        detail:
          "Tenant records that own facilities, subscriptions, and compliance requirements.",
      },
      {
        name: "Locations",
        detail:
          "Plants, buildings, and zones that provide geo context for assets and inventory.",
      },
      {
        name: "Vendors",
        detail:
          "External partners, contractors, and suppliers with scores, contacts, and specialties.",
      },
      {
        name: "Contracts",
        detail:
          "Service level agreements, warranties, and vendor terms bound to assets or work orders.",
      },
    ],
  },
  {
    title: "Asset & Maintenance",
    description:
      "All records that track asset lifecycles, work, inspections, and reliability.",
    items: [
      {
        name: "Assets",
        detail:
          "Equipment records with hierarchy, QR codes, specs, and criticality scores.",
      },
      {
        name: "Meters",
        detail:
          "Runtime hours, temperature, pressure, production counts, or any quantitative reading.",
      },
      {
        name: "SensorData",
        detail:
          "Time-series IoT payloads ingested from gateways and mapped back to assets/meters.",
      },
      {
        name: "WorkOrders",
        detail:
          "Actionable tickets that include tasks, checklists, assignees, and status history.",
      },
      {
        name: "MaintenanceTasks",
        detail:
          "Reusable tasks/checklists linked to work orders or preventive programs.",
      },
      {
        name: "Schedules",
        detail:
          "Calendar and meter-based cadence definitions with escalation rules.",
      },
      {
        name: "MaintenanceHistory",
        detail:
          "Immutable log of work, findings, labor hours, and parts consumed across assets.",
      },
      {
        name: "Inspections",
        detail:
          "Structured audits with scoring, attachments, and compliance attestations.",
      },
      {
        name: "Procedures",
        detail:
          "Step-by-step instructions, safety gates, and AR overlays tied to task templates.",
      },
      {
        name: "ComplianceRecords",
        detail:
          "Regulatory evidence, permits, and audit outcomes referencing assets or teams.",
      },
      {
        name: "Warranties",
        detail:
          "Coverage terms, expiration dates, and claim info for assets/components.",
      },
    ],
  },
  {
    title: "Inventory & Commerce",
    description:
      "Entities that ensure the right materials are on hand and financially tracked.",
    items: [
      {
        name: "Inventory",
        detail:
          "On-hand counts, min/max thresholds, costs, bins, and valuation snapshots.",
      },
      {
        name: "Parts",
        detail:
          "Catalog of spare parts referenced by work orders, vendors, and procurement.",
      },
      {
        name: "PurchaseOrders",
        detail:
          "Requests/reservations for parts or services with approval flow and fulfillment data.",
      },
      {
        name: "TimeEntries",
        detail:
          "Technician labor logs for billing, analytics, and cost-of-maintenance modeling.",
      },
      {
        name: "Documents",
        detail:
          "Manuals, photos, AR assets, and compliance files stored in Supabase Storage.",
      },
      {
        name: "Notifications",
        detail:
          "Email, SMS, push, and webhook events triggered by work, alerts, or automations.",
      },
    ],
  },
];

const apiGroups = [
  {
    prefix: "/auth",
    detail: "Session management, role provisioning, SSO callbacks, MFA enrollment.",
  },
  {
    prefix: "/users",
    detail:
      "CRUD for user profiles, roles, certifications, and technician availability.",
  },
  {
    prefix: "/assets",
    detail:
      "Hierarchy operations, QR metadata, meter associations, warranty references.",
  },
  {
    prefix: "/work-orders",
    detail:
      "Create, assign, update, close, add comments, attach documents, log time.",
  },
  {
    prefix: "/maintenance",
    detail:
      "Templates, procedures, schedules, preventive programs, and history exports.",
  },
  {
    prefix: "/inventory",
    detail:
      "Stock counts, adjustments, reorder suggestions, valuation reports, cycle counts.",
  },
  {
    prefix: "/parts",
    detail:
      "Catalog search, BOM management, alternates/cross references, vendor pricing.",
  },
  {
    prefix: "/vendors",
    detail:
      "Onboard vendors, track performance, manage contracts, sync insurance docs.",
  },
  {
    prefix: "/locations",
    detail:
      "CRUD for plants, zones, lines, including GIS/geo search and multi-site filters.",
  },
  {
    prefix: "/organizations",
    detail:
      "Tenant metadata, subscription plans, billing identifiers, compliance posture.",
  },
  {
    prefix: "/reports",
    detail:
      "Generate KPIs (uptime, MTTR, preventive ratio) and export CSV/PDF dashboards.",
  },
  {
    prefix: "/notifications",
    detail:
      "Subscribe/unsubscribe endpoints plus channels for email, SMS, push, Slack.",
  },
  {
    prefix: "/documents",
    detail:
      "Upload/download manuals, inspection photos, AR assets, signed compliance forms.",
  },
  {
    prefix: "/integrations",
    detail:
      "OAuth connectors and configuration for ERP, procurement, calendar, SSO, IoT.",
  },
  {
    prefix: "/sensors",
    detail:
      "Ingest IoT payloads, query time-series summaries, manage device credentials.",
  },
  {
    prefix: "/analytics",
    detail:
      "AI insights, predictive maintenance scores, anomaly detection, cost forecasts.",
  },
  {
    prefix: "/mobile",
    detail:
      "Mobile-optimized endpoints for offline sync, QR scans, and photo uploads.",
  },
  {
    prefix: "/webhooks",
    detail:
      "Outbound callbacks to ERP/procurement, inbound events from vendors or calendar tools.",
  },
];

export default function DataModelPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <header className="space-y-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Data model & API blueprint
          </p>
          <h1 className="text-4xl font-semibold leading-tight">
            CMMS domain entities and REST endpoints
          </h1>
          <p className="max-w-3xl text-white/70">
            This reference maps the March 10, 2026 SRS into concrete data
            concepts and HTTP groups. Use it to align Supabase schemas,
            server actions, and mobile clients around one contract.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key entity families</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {entityGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <p className="text-sm uppercase tracking-wide text-white/60">
                  {group.title}
                </p>
                <p className="mt-2 text-sm text-white/70">{group.description}</p>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  {group.items.map((item) => (
                    <li key={item.name} className="rounded-2xl border border-white/10 p-3">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-white/70">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">API endpoint groups</h2>
            <p className="text-white/70">
              Each group exposes RESTful CRUD plus domain-specific actions. Layer
              Supabase RLS policies and API keys/JWT on top.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {apiGroups.map((api) => (
              <article
                key={api.prefix}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm"
              >
                <p className="text-xs font-mono uppercase tracking-wide text-emerald-400">
                  {api.prefix}
                </p>
                <p className="mt-2 text-white/80">{api.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold">Implementation notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              Mirror each entity above to Supabase tables with consistent UUID
              primary keys, soft delete columns, and `org_id` for multi-tenant isolation.
            </li>
            <li>
              Publish typed client SDKs (TypeScript + mobile) from this schema so
              dashboard, mobile, and partner portals remain in sync.
            </li>
            <li>
              Use `/webhooks` for ERP/purchasing notifications and `/integrations`
              for OAuth token storage and sync schedules.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
