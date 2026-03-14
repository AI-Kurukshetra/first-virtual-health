-- Next-Gen CMMS foundational schema
-- Generated March 14, 2026

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists postgis;

----------------------------------------------------------------
-- 0. Helper types
----------------------------------------------------------------
create type work_order_status as enum ('draft','scheduled','in_progress','blocked','completed','cancelled');
create type work_order_priority as enum ('low','medium','high','critical');
create type asset_status as enum ('online','maintenance','offline','degraded');
create type asset_criticality as enum ('low','medium','high');
create type schedule_type as enum ('calendar','meter');
create type maintenance_type as enum ('corrective','preventive','inspection');
create type notification_channel as enum ('email','sms','push','webhook');
create type notification_status as enum ('queued','sent','failed');
create type compliance_status as enum ('pending','passed','failed');
create type vendor_contract_type as enum ('service','warranty','rental');

----------------------------------------------------------------
-- 1. Identity & Access
----------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  industry text,
  plan text default 'pilot',
  timezone text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  shift text,
  skills text[] default '{}',
  supervisor_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  phone text,
  full_name text,
  role text check (role in ('admin','planner','technician','vendor')) default 'technician',
  status text default 'invited',
  team_id uuid references public.teams(id),
  locale text,
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, email)
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  parent_location_id uuid references public.locations(id) on delete set null,
  name text not null,
  address text,
  geo geography(point,4326),
  timezone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  category text,
  contact_name text,
  contact_email text,
  contact_phone text,
  score numeric(3,2),
  last_engaged_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete cascade,
  title text not null,
  type vendor_contract_type default 'service',
  start_date date,
  end_date date,
  terms text,
  document_refs uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

----------------------------------------------------------------
-- 2. Asset Registry & Telemetry
----------------------------------------------------------------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  parent_asset_id uuid references public.assets(id) on delete set null,
  code text not null,
  name text not null,
  description text,
  category text,
  criticality asset_criticality default 'medium',
  status asset_status default 'online',
  manufacturer text,
  model text,
  serial_number text,
  commissioned_at date,
  qr_code_url text,
  custom_fields jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, code)
);

create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  coverage text,
  expires_at date,
  documents uuid[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.meters (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references public.assets(id) on delete cascade,
  type text not null,
  unit text,
  threshold_warning numeric,
  threshold_critical numeric,
  created_at timestamptz default now()
);

create table if not exists public.meter_readings (
  id bigserial primary key,
  meter_id uuid references public.meters(id) on delete cascade,
  captured_at timestamptz not null,
  value numeric not null,
  source text default 'manual'
);

create table if not exists public.sensor_data (
  id bigserial primary key,
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  sensor_type text,
  payload jsonb not null,
  captured_at timestamptz not null default now(),
  gateway_id text
);

----------------------------------------------------------------
-- 3. Procedures, Tasks, Schedules
----------------------------------------------------------------
create table if not exists public.procedures (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  category text,
  steps jsonb default '[]'::jsonb,
  estimated_minutes integer,
  safety_gates jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  procedure_id uuid references public.procedures(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  type maintenance_type default 'corrective',
  priority work_order_priority default 'medium',
  description text,
  attachment_refs uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete cascade,
  name text not null,
  type schedule_type default 'calendar',
  frequency interval,
  meter_id uuid references public.meters(id) on delete set null,
  meter_threshold numeric,
  next_run_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

----------------------------------------------------------------
-- 4. Work Orders & History
----------------------------------------------------------------
create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  location_id uuid references public.locations(id) on delete set null,
  title text not null,
  description text,
  status work_order_status default 'draft',
  priority work_order_priority default 'medium',
  requested_by uuid references public.users(id) on delete set null,
  assigned_team_id uuid references public.teams(id) on delete set null,
  assignee_ids uuid[] default '{}',
  due_at timestamptz,
  completed_at timestamptz,
  tags text[] default '{}',
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.work_order_tasks (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid references public.work_orders(id) on delete cascade,
  maintenance_task_id uuid references public.maintenance_tasks(id) on delete set null,
  status text default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid references public.work_orders(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz,
  hours numeric(5,2),
  created_at timestamptz default now()
);

create table if not exists public.maintenance_history (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid references public.work_orders(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  summary text,
  findings text,
  downtime_minutes integer,
  cost_materials numeric,
  cost_labor numeric,
  document_refs uuid[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  inspector_id uuid references public.users(id) on delete set null,
  checklist jsonb default '[]'::jsonb,
  score numeric,
  status text,
  inspected_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.compliance_records (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  type text,
  status compliance_status default 'pending',
  due_at timestamptz,
  document_refs uuid[] default '{}',
  created_at timestamptz default now()
);

----------------------------------------------------------------
-- 5. Inventory & Procurement
----------------------------------------------------------------
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  sku text,
  description text,
  quantity_on_hand integer default 0,
  quantity_reserved integer default 0,
  uom text,
  min_threshold integer default 0,
  max_threshold integer,
  reorder_point integer,
  unit_cost numeric,
  storage_location text,
  supplier_id uuid references public.vendors(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, sku)
);

create table if not exists public.parts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  quantity_required integer default 1,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  status text default 'draft',
  total_amount numeric,
  currency text default 'USD',
  requested_by uuid references public.users(id) on delete set null,
  approved_by uuid references public.users(id) on delete set null,
  expected_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid references public.purchase_orders(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  description text,
  quantity integer,
  unit_price numeric
);

----------------------------------------------------------------
-- 6. Content & Notifications
----------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  storage_path text not null,
  mime_type text,
  file_size_bytes integer,
  category text,
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.media_annotations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade,
  work_order_id uuid references public.work_orders(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  caption text,
  ai_tags text[] default '{}'
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  type text not null,
  payload jsonb not null,
  channel notification_channel default 'email',
  recipient_ids uuid[] default '{}',
  sent_at timestamptz,
  status notification_status default 'queued',
  created_at timestamptz default now()
);

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  url text not null,
  description text,
  secret text,
  events text[] default '{}',
  status text default 'active',
  created_at timestamptz default now()
);

----------------------------------------------------------------
-- 7. Analytics & Automation
----------------------------------------------------------------
create table if not exists public.predictive_insights (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  source text,
  impact text,
  severity text,
  message text,
  recommendation text,
  generated_at timestamptz default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  trigger jsonb not null,
  action jsonb not null,
  enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

----------------------------------------------------------------
-- 8. Waitlist (marketing)
----------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  use_case text,
  source text default 'nextjs-starter',
  inserted_at timestamptz default timezone('utc', now())
);

----------------------------------------------------------------
-- 9. RLS Enablement
----------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.teams enable row level security;
alter table public.users enable row level security;
alter table public.locations enable row level security;
alter table public.vendors enable row level security;
alter table public.contracts enable row level security;
alter table public.assets enable row level security;
alter table public.warranties enable row level security;
alter table public.meters enable row level security;
alter table public.meter_readings enable row level security;
alter table public.sensor_data enable row level security;
alter table public.procedures enable row level security;
alter table public.maintenance_tasks enable row level security;
alter table public.schedules enable row level security;
alter table public.work_orders enable row level security;
alter table public.work_order_tasks enable row level security;
alter table public.time_entries enable row level security;
alter table public.maintenance_history enable row level security;
alter table public.inspections enable row level security;
alter table public.compliance_records enable row level security;
alter table public.inventory_items enable row level security;
alter table public.parts enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_lines enable row level security;
alter table public.documents enable row level security;
alter table public.media_annotations enable row level security;
alter table public.notifications enable row level security;
alter table public.webhooks enable row level security;
alter table public.predictive_insights enable row level security;
alter table public.automation_rules enable row level security;
alter table public.waitlist enable row level security;
alter table if exists public.workspace_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'waitlist'
      and policyname = 'waitlist service insert'
  ) then
    create policy "waitlist service insert" on public.waitlist
      for insert with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'waitlist'
      and policyname = 'waitlist service select'
  ) then
    create policy "waitlist service select" on public.waitlist
      for select using (auth.role() = 'service_role');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'workspace_requests'
  ) then
    create table public.workspace_requests (
      id uuid primary key default gen_random_uuid(),
      full_name text not null,
      company text not null,
      email text not null,
      plants integer,
      goal text,
      status text default 'new',
      created_at timestamptz default now()
    );
  end if;
end
$$;

alter table public.workspace_requests enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'workspace_requests'
      and policyname = 'workspace_requests service insert'
  ) then
    create policy "workspace_requests service insert" on public.workspace_requests
      for insert with check (auth.role() = 'service_role');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'workspace_requests'
      and policyname = 'workspace_requests service select'
  ) then
    create policy "workspace_requests service select" on public.workspace_requests
      for select using (auth.role() = 'service_role');
  end if;
end
$$;
