# Next-Gen CMMS - High-Level Architecture

## 1. System goals recap
- Digitize the entire asset and maintenance lifecycle for manufacturing plants with 50-500 assets.
- Provide a mobile-first experience (offline-capable work orders, QR/AR lookups) plus a powerful web cockpit.
- Unlock predictive maintenance with IoT telemetry, AI/ML scoring, and inventory automation.
- Ship as an API-friendly SaaS on Vercel + Supabase while remaining extensible to native apps and partner portals.

## 2. Logical architecture
```
+--------------------------------------------------------------------------+
|                        Experience & Delivery Layer                       |
|  Web App (Next.js 16) | Mobile App (React Native) | Partner Portal       |
+-----------------------+---------------------------+----------------------+
|                 Application & Integration Services                       |
|  - Next.js server actions + REST/webhook handlers                        |
|  - Supabase Edge Functions (business logic, IoT ingest, ML triggers)     |
|  - Realtime channels and scheduled jobs                                  |
+--------------------------------------------------------------------------+
|                                Data Layer                                |
|  - Supabase Postgres (assets, work_orders, meters, inventory, vendors)   |
|  - Supabase Storage (manuals, photos, AR overlays, safety docs)          |
|  - Supabase Auth (roles: Admin, Planner, Technician, Vendor)             |
+--------------------------------------------------------------------------+
|                 Intelligence & Connectivity Layer                        |
|  - IoT gateways (MQTT/OPC-UA -> Edge Function ingest)                    |
|  - AI/ML services (predictive maintenance, cost forecasting)             |
|  - External integrations (ERP, procurement, calendar, SSO)               |
+--------------------------------------------------------------------------+
```

### Key flows
1. **Operations flow** - Clients call server actions/route handlers which enforce RLS-backed access against Supabase.
2. **Predictive flow** - IoT telemetry lands in Supabase via Edge Functions, feeding models that write to `predictive_insights`.
3. **Notification flow** - Domain events push through Supabase Realtime, background jobs, and optional webhooks/Slack/email.

## 3. Deployment view
- **Vercel** hosts the marketing site, dashboard, API routes, and server actions (edge when needed).
- **Supabase** provides Postgres, Auth, Storage, Realtime, Edge Functions, and scheduled jobs.
- **Mobile** apps authenticate with Supabase, cache data locally, and sync via REST/Realtime once online.
- **Observability** runs through Vercel Analytics, Supabase logs, and optional Logflare/Datadog sinks.

## 4. Recommended folder structure
```
.
|-- app/
|   |-- (marketing)/          # Hero, roadmap, waitlist, storytelling
|   |-- (dashboard)/          # Authenticated CMMS cockpit
|   |-- mobile/               # (Future) PWA shell & QR workflows
|   |-- api/
|   |   |-- assets/route.ts
|   |   |-- work-orders/route.ts
|   |   |-- inventory/route.ts
|   |   |-- insights/route.ts
|   |   `-- webhooks/*        # Vendor, IoT, calendar callbacks
|   `-- actions/              # Server actions (waitlist, work orders, etc.)
|-- components/
|   |-- marketing/            # Landing page sections
|   |-- dashboard/            # KPIs, grids, forms
|   |-- forms/                # Reusable form controls
|   `-- ui/                   # Base design system primitives
|-- lib/
|   |-- data/                 # Mock fixtures & seeds
|   |-- types/                # Domain models (Assets, WorkOrders, etc.)
|   |-- supabase/             # Client helpers + queries
|   |-- services/             # Future modules (predictive, inventory)
|   `-- utils/                # Formatters, constants, feature flags
|-- docs/
|   |-- ARCHITECTURE.md       # This file
|   |-- DATA_MODEL.md         # Table definitions & ERD
|   `-- API_CONTRACT.md       # REST/GraphQL surfaces
|-- mobile/                   # React Native/Expo workspace (future)
|-- infra/
|   |-- supabase/             # SQL migrations, RLS policies
|   |-- vercel/               # Project configs, env templates
|   `-- iac/                  # Terraform/Pulumi for IoT gateways
`-- tests/
    |-- e2e/                  # Playwright scenarios
    `-- integration/          # API contract tests
```

## 5. Next steps
1. Finalize the Supabase schema + RLS policies (`docs/DATA_MODEL.md` + `infra/supabase` migrations).
2. Replace mocks with live Supabase queries inside server actions and API routes.
3. Build Supabase Edge Functions for IoT ingest and ML-triggered insights.
4. Spin up the `mobile/` workspace and share domain types via a reusable package.
5. Add integration adapters (calendar sync, ERP purchasing, notifications) under `lib/services`.
