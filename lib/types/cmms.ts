export type AssetCriticality = "low" | "medium" | "high";
export type AssetStatus = "online" | "offline" | "maintenance" | "degraded";

export interface MeterReading {
  type: string;
  value: number;
  unit: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  code: string;
  location: string;
  category: string;
  criticality: AssetCriticality;
  status: AssetStatus;
  uptimePercent: number;
  healthScore: number;
  nextMaintenance: string;
  assignedTeam: string;
  meters: MeterReading[];
}

export type WorkOrderPriority = "low" | "medium" | "high" | "critical";
export type WorkOrderStatus =
  | "scheduled"
  | "in-progress"
  | "blocked"
  | "completed";

export interface WorkOrder {
  id: string;
  title: string;
  assetId: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dueDate: string;
  requestedBy: string;
  assignedTo: string[];
  location: string;
  tags: string[];
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minThreshold: number;
  unitCost: number;
  storageLocation: string;
  lastCounted: string;
  supplier: string;
}

export interface MaintenanceScheduleBlock {
  id: string;
  title: string;
  assetId: string;
  start: string;
  end: string;
  team: string;
  type: "preventive" | "inspection" | "calibration";
}

export interface SafetyAlert {
  id: string;
  headline: string;
  description: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
  relatedAssetId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  score: number;
  lastEngaged: string;
}

export interface MaintenanceInsight {
  id: string;
  title: string;
  description: string;
  impact: "downtime" | "cost" | "safety";
  recommendation: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  trend: number;
  helperText: string;
}
