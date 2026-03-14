# Next-Gen CMMS - Supabase Setup Guide

This walkthrough explains how to apply the provided schema (`infra/supabase/migrations/20260314_initial_schema.sql`) to your Supabase project.

## Prerequisites
1. Supabase project created and API keys stored in `.env.local`.
2. Supabase CLI installed (`npm install -g supabase`) if you want to run migrations from your machine. Otherwise, you can use the SQL editor in the Supabase dashboard.

## Option A: Apply via Supabase Dashboard (quick)
1. Open https://app.supabase.com → select your project.
2. Click **SQL Editor** in the left sidebar.
3. Create a new query, paste the contents of `infra/supabase/migrations/20260314_initial_schema.sql`.
4. Hit **Run**. Supabase will execute the script and create all tables, enums, and policies.
5. Verify under **Table Editor** that the entities (organizations, assets, work_orders, inventory_items, etc.) now exist.

## Option B: Apply via Supabase CLI (versioned migrations)
1. Authenticate the CLI:
   ```bash
   supabase login
   ```
   Paste the access token from your Supabase account settings.
2. Link the project (run inside the repo root):
   ```bash
   supabase link --project-ref <your-project-ref>
   ```
   Replace `<your-project-ref>` with the slug from the Supabase dashboard URL.
3. Run migrations:
   ```bash
   supabase db push
   ```
   The CLI reads SQL files under `supabase/migrations` by default. Since this repo keeps them under `infra/supabase/migrations`, either:
   - Move the file into `supabase/migrations`, **or**
   - Symlink/adjust CLI config (`supabase/config.toml`) to point to `infra/supabase/migrations`.

   Example using symlink on Windows PowerShell:
   ```powershell
   New-Item -ItemType SymbolicLink -Path .\supabase\migrations -Target .\infra\supabase\migrations
   supabase db push
   ```
4. The CLI applies migrations in order and stores their status in Supabase. You can run `supabase db reset` to recreate the schema locally if needed.

## Seeding data
- Use the Supabase Table Editor or `supabase db query` to insert sample organizations, locations, assets, etc.
- For repeatable seeds, create SQL files under `infra/supabase/seeds` and apply them manually or via CLI.

## After schema sync
1. Update Supabase RLS policies beyond the basic waitlist rule; create policies per table/role (admin, planner, technician, vendor).
2. Update your Next.js server actions/API routes to query Supabase instead of mock data.
3. Configure Supabase Storage buckets (`documents`, `media`, `ar_assets`) for files referenced by the `documents` table.

Following these steps ensures your Supabase database matches the detailed schema laid out in `docs/DATA_MODEL.md`.
