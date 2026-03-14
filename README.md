# Next-Gen CMMS - Smart Asset & Maintenance Platform

This monorepo-ready Next.js project demonstrates how to stand up a manufacturing-focused CMMS/EAM experience that mirrors the March 10, 2026 SRS. It includes:

- Marketing/vision page (`/`) that summarizes the MVP, differentiators, API surface, and go-to-market story.
- A live dashboard prototype (`/dashboard`) with KPIs, work orders, asset health, preventive schedules, inventory, vendors, and alerting.
- Supabase-ready waitlist capture (`WaitlistForm`) for onboarding beta manufacturers.
- Mock APIs (`/api/assets`, `/api/work-orders`, `/api/inventory`, `/api/insights`) that mirror the eventual backend contract.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS (via `@tailwindcss/postcss`)
- Supabase JS client (waitlist + future CMMS data)
- Edge-ready route handlers for performant APIs

## Running locally

1. Install dependencies.
   ```bash
   npm install
   ```
2. Copy the example environment file and add your Supabase project keys.
   ```bash
   cp .env.example .env.local
   ```
3. Start the dev server.
   ```bash
   npm run dev
   ```
4. Visit:
   - `http://localhost:3000` for the marketing/SRS overview.
   - `http://localhost:3000/dashboard` for the CMMS cockpit.
   - `http://localhost:3000/api/assets` etc. to inspect JSON contracts.

## Data scaffolding

Mock data for assets, work orders, inventory, safety alerts, vendors, and AI insights lives in `lib/data/mock.ts`. Types align with the SRS entities and are shared across UI + API handlers via `lib/types/cmms.ts`.

When connecting to Supabase or another backend, replace these mocks inside server components and route handlers with real queries, keeping the shape identical to maintain UI parity.

## Feature coverage (mapped to SRS)

- **Asset registry** — hierarchy, QR/barcode hook, warranties, meters; see `/dashboard` cards + `/api/assets`.
- **Work orders & PM** — intake, routing, SLA clocks, preventive plans; timeline + schedule board mirror SRS flows.
- **Inventory & vendors** — stock levels, reorder signals, supplier scorecards; inventory panel + `/api/inventory`.
- **User roles & auth** — workspace login, admin login, Supabase-backed waitlist and workspace requests.
- **Safety & insights** — alert panel and AI insight feed wired to `/api/insights`.
- **MVP data model** — entities align with README SRS: Assets, WorkOrders, Inventory, Vendors, Locations, Users, etc.
- **Extensible API surface** — mock routes for assets, work-orders, inventory, insights; ready to extend to `/analytics`, `/notifications`, `/mobile`, `/webhooks` per SRS.

## Next steps

1. Connect Supabase tables (`assets`, `work_orders`, `inventory`, `vendors`, `alerts`) and update the server components to read from the database.
2. Expand the API surface (`/analytics`, `/notifications`, `/mobile`) and secure with JWT-based auth.
3. Layer in realtime IoT feeds (Supabase Realtime, MQTT) to unlock predictive maintenance cards.
4. Build the dedicated mobile shell (React Native + Expo) that mirrors the core workflow offline.

Happy building!
