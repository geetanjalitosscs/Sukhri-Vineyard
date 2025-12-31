/**
 * API Module - Centralized Export
 * 
 * This is the main entry point for all API services.
 * Import from here: import { authService, attendanceService } from '@/api'
 */

// Configuration
export { apiClient, API_BASE_URL } from './config/api.config';

// Services
export { authService } from './services/auth.service';
export type { LoginRequest, LoginResponse, ProfileResponse } from './services/auth.service';

export { attendanceService } from './services/attendance.service';
export type { TodayAttendanceResponse, WeeklyStatsResponse, AttendanceRecord } from './services/attendance.service';

export { co2Service } from './services/co2.service';
export type { Co2Barrel, OverdueResponse } from './services/co2.service';

export { inventoryService } from './services/inventory.service';
export type { InventoryItem, InventoryResponse, LowStockResponse } from './services/inventory.service';

export { temperatureService } from './services/temperature.service';
export type { TemperatureReading, TemperatureStats } from './services/temperature.service';

export { vendorsService } from './services/vendors.service';
export type { Vendor, PurchaseOrder, PurchaseOrderItem, PurchaseOrdersResponse } from './services/vendors.service';

export { usersService } from './services/users.service';
export type { User } from './services/users.service';

export { aiService } from './services/ai.service';

export { devicesService } from './services/devices.service';
export type { Device, DevicesResponse } from './services/devices.service';

export { tasksService } from './services/tasks.service';
export type { Task, TasksResponse } from './services/tasks.service';

export { postsService } from './services/posts.service';
export type { Post } from './services/posts.service';

