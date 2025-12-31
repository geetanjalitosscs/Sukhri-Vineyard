// Centralized type definitions
// Re-export types from API services for consistent usage across the app

import type {
  Co2Barrel,
  OverdueResponse,
} from "@/api/services/co2.service";

export type {
  Co2Barrel,
  OverdueResponse,
} from "@/api/services/co2.service";

export type {
  AttendanceRecord,
  TodayAttendanceResponse,
  WeeklyStatsResponse,
} from "@/api/services/attendance.service";

export type {
  InventoryItem,
  InventoryResponse,
  LowStockResponse,
} from "@/api/services/inventory.service";

export type {
  Task,
  TasksResponse,
  CreateTaskRequest,
} from "@/api/services/tasks.service";

export type {
  User,
  CreateUserRequest,
} from "@/api/services/users.service";

export type {
  Vendor,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrdersResponse,
} from "@/api/services/vendors.service";

import type {
  TemperatureReading,
  TemperatureStats,
} from "@/api/services/temperature.service";

export type {
  TemperatureReading,
  TemperatureStats,
} from "@/api/services/temperature.service";

// Additional common types
export interface RefillForm {
  quantity: string;
  sensorReading: string;
  notes: string;
}

export interface Co2Data {
  barrels: Co2Barrel[];
  overdue: number;
  dueThisWeek: number;
}

export interface TemperatureData {
  readings: TemperatureReading[];
  average: number;
  max: number;
  min: number;
  alerts: number;
}

