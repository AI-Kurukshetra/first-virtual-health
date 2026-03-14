# Next-Gen CMMS - Data Model & API Reference

This document translates the March 10, 2026 SRS into a relational schema suitable for Supabase/Postgres. Every table includes a suggested set of columns, constraints, and relationships (FKs). Adopt UUID primary keys with `gen_random_uuid()` (enable pgcrypto). All tables should include `created_at timestamptz default now()` and `updated_at timestamptz default now()` (update via trigger) unless noted otherwise.

> **Multi-tenancy note**: Prefix every operational table with `org_id uuid references organizations(id)` and enable RLS to restrict rows to the signed-in tenant. For brevity, `org_id` is implied below even when not repeated.

## 1. Identity & Access

### organizations
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | Legal name |
| slug | text unique | Used for vanity URLs |
| industry | text | Manufacturing segment |
| plan | text default 'pilot' | ties to billing |
| timezone | text | default plant tz |
| status | text default 'active' | suspended, trialing |

### teams
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| name | text |
| shift | text | e.g., A, B, C |
| skills | text[] | welding, robotics |
| supervisor_id | uuid references users(id) |

### users
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| email | text unique (org scoped) |
| phone | text |
| full_name | text |
| role | text | admin, planner, technician, vendor |
| status | text | invited, active, suspended |
| team_id | uuid references teams(id) |
| locale | text |
| last_seen_at | timestamptz |

### locations
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| parent_location_id | uuid self FK | building hierarchy |
| name | text |
| address | text |
| geo | geography(Point,4326) | optional |
| timezone | text |

### vendors
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| name | text |
| category | text | calibration, robotics, etc. |
| contact_name | text |
| contact_email | text |
| contact_phone | text |
| score | numeric(3,2) | 0-5 rating |
| last_engaged_at | timestamptz |

### contracts
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| vendor_id | uuid FK |
| title | text |
| type | text | service, warranty, rental |
| start_date, end_date | date |
| terms | text |
| documents | uuid[] references documents(id) |

## 2. Asset Registry & Telemetry

### assets
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| location_id | uuid references locations(id) |
| parent_asset_id | uuid self FK |
| code | text unique (org scoped) |
| name | text |
| description | text |
| category | text |
| criticality | text check in ('low','medium','high') |
| status | text check in ('online','maintenance','offline','degraded') |
| manufacturer | text |
| model | text |
| serial_number | text |
| commissioned_at | date |
| qr_code_url | text |
| custom_fields | jsonb |

### meters
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| asset_id | uuid FK |
| type | text | runtime, temperature |
| unit | text |
| threshold_warning | numeric |
| threshold_critical | numeric |

### meter_readings
| Column | Type | Notes |
| --- | --- | --- |
| id | bigserial PK |
| meter_id | uuid FK |
| captured_at | timestamptz |
| value | numeric |
| source | text | manual, IoT |

### sensor_data
| Column | Type | Notes |
| --- | --- | --- |
| id | bigserial PK |
| asset_id | uuid FK |
| sensor_type | text | vibration, thermal |
| payload | jsonb |
| captured_at | timestamptz |
| gateway_id | text |

### warranties
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| asset_id | uuid FK |
| vendor_id | uuid FK |
| coverage | text |
| expires_at | date |
| documents | uuid[] |

## 3. Work Execution

### procedures
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| title | text |
| category | text |
| steps | jsonb | ordered instructions |
| estimated_minutes | integer |
| safety_gates | jsonb |

### maintenance_tasks
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| procedure_id | uuid FK |
| asset_id | uuid FK |
| type | text | corrective, preventive, inspection |
| priority | text |
| description | text |
| attachments | uuid[] references documents(id) |

### work_orders
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| location_id | uuid FK |
| title | text |
| description | text |
| status | text check in ('draft','scheduled','in_progress','blocked','completed','cancelled') |
| priority | text check in ('low','medium','high','critical') |
| requested_by | uuid references users(id) |
| assigned_team_id | uuid references teams(id) |
| assignee_ids | uuid[] references users(id) |
| due_at | timestamptz |
| completed_at | timestamptz |
| tags | text[] |
| source | text | manual, sensor, predictive model |

### work_order_tasks (join between work orders & maintenance tasks)
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| work_order_id | uuid FK |
| maintenance_task_id | uuid FK |
| status | text |
| notes | text |

### schedules
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| name | text |
| type | text check in ('calendar','meter') |
| frequency | interval | e.g., '30 days' |
| meter_threshold | numeric | for meter-based |
| next_run_at | timestamptz |
| last_run_at | timestamptz |

### maintenance_history
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| work_order_id | uuid FK |
| asset_id | uuid FK |
| summary | text |
| findings | text |
| downtime_minutes | integer |
| cost_materials | numeric |
| cost_labor | numeric |
| documents | uuid[] |

### inspections
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| inspector_id | uuid references users(id) |
| checklist | jsonb |
| score | numeric |
| status | text |
| inspected_at | timestamptz |

### compliance_records
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| type | text | OSHA, ISO 55000 |
| status | text | pending, passed, failed |
| due_at | timestamptz |
| documents | uuid[] |

### time_entries
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| work_order_id | uuid FK |
| user_id | uuid FK |
| started_at | timestamptz |
| ended_at | timestamptz |
| hours | numeric(5,2) generated always as (extract(epoch from (ended_at - started_at))/3600) stored |

## 4. Inventory & Procurement

### inventory_items
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| name | text |
| sku | text unique (org scoped) |
| description | text |
| quantity_on_hand | integer |
| quantity_reserved | integer |
| uom | text |
| min_threshold | integer |
| max_threshold | integer |
| reorder_point | integer |
| unit_cost | numeric |
| storage_location | text |
| supplier_id | uuid references vendors(id) |

### parts (BOM)
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| inventory_item_id | uuid references inventory_items(id) |
| quantity_required | integer |
| notes | text |

### purchase_orders
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| vendor_id | uuid FK |
| status | text | draft, submitted, approved, received |
| total_amount | numeric |
| currency | text |
| requested_by | uuid references users(id) |
| approved_by | uuid references users(id) |
| expected_at | date |

### purchase_order_lines
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| purchase_order_id | uuid FK |
| inventory_item_id | uuid FK |
| description | text |
| quantity | integer |
| unit_price | numeric |

## 5. Content & Notifications

### documents
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| storage_path | text | Supabase Storage reference |
| mime_type | text |
| file_size_bytes | integer |
| category | text | manual, photo, compliance |
| uploaded_by | uuid references users(id) |

### media_annotations (photo/video metadata)
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| document_id | uuid FK |
| work_order_id | uuid FK |
| asset_id | uuid FK |
| caption | text |
| ai_tags | text[] |

### notifications
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| type | text | work_order_assigned, low_inventory |
| payload | jsonb |
| channel | text | email, sms, push, webhook |
| recipient_ids | uuid[] |
| sent_at | timestamptz |
| status | text | queued, sent, failed |

### webhooks
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| url | text |
| description | text |
| secret | text |
| events | text[] |
| status | text | active, paused |

## 6. Predictive & Analytics

### predictive_insights
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| asset_id | uuid FK |
| source | text | ML model name |
| impact | text | downtime, cost, safety |
| severity | text | info, warning, critical |
| message | text |
| recommendation | text |
| generated_at | timestamptz |

### automation_rules
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK |
| org_id | uuid FK |
| name | text |
| trigger | jsonb | e.g., meter threshold, vendor SLA |
| action | jsonb | create work order, send notification |
| enabled | boolean |

## 7. Waitlist / Marketing (existing)
`waitlist` table already described earlier; keep as-is for GTM.

## 8. API Endpoint Groups (CRUD + actions)
| Endpoint | Backed Tables | Key Actions |
| --- | --- | --- |
| `/auth` | Supabase auth schema | sign-up, login, MFA, SSO |
| `/users` | users, teams | CRUD users, assign roles, availability |
| `/assets` | assets, meters, warranties, documents | CRUD assets, attach docs, list meters |
| `/work-orders` | work_orders, work_order_tasks, time_entries | Create/update work orders, add comments, log time, complete |
| `/maintenance` | maintenance_tasks, schedules, maintenance_history, procedures | Manage templates, generate PMs, view history |
| `/inventory` | inventory_items | Adjust stock, transfer between locations |
| `/parts` | parts, inventory_items | Manage BOM, link to assets |
| `/vendors` | vendors, contracts, warranties | Scorecard, onboarding |
| `/locations` | locations | CRUD, hierarchy |
| `/organizations` | organizations | Plan management, billing status |
| `/reports` | analytics views | KPI exports, PDF summaries |
| `/notifications` | notifications, webhooks | Preferences, send test |
| `/documents` | documents | Upload/download, metadata |
| `/integrations` | webhooks, automation_rules | OAuth connectors, sync jobs |
| `/sensors` | sensor_data, meters | Ingest telemetry, query time-series |
| `/analytics` | predictive_insights | Fetch AI insights, acknowledge |
| `/mobile` | offline snapshot views | sync packages, asset QR lookups |
| `/webhooks` | webhooks | Inbound/outbound event handling |

## 9. Implementation recommendations
- Create SQL migration files under `infra/supabase/migrations` mirroring the tables above.
- Enable RLS on every table and craft policies per role (admin, planner, technician, vendor). Example: technicians can `select` assets only within their team’s locations.
- Use Supabase Storage buckets: `documents`, `media`, `ar_assets`.
- Create database views for reporting (`v_asset_uptime`, `v_preventive_ratio`) feeding `/reports`.
- For predictive maintenance, store ML outputs in `predictive_insights` and reference them when auto-creating work orders via automation rules.
- When implementing mobile offline sync, create lightweight endpoints (under `/mobile`) that stream compact datasets (assets summary, pending work orders, inventory watchlist) leveraging Supabase’s row-level subscription features.

This schema covers all entities and advanced features in the SRS while leaving room for future modules (digital twins, blockchain records, drone inspections) by extending `sensor_data`, `documents`, and `automation_rules`.
