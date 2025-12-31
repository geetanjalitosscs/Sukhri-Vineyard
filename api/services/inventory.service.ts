/**
 * Inventory Service
 * Handles all inventory-related API calls
 */

import apiClient from '../config/api.config';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  status: string;
  supplier: string;
  lastOrdered?: string | null;
}

export interface InventoryResponse {
  items: InventoryItem[];
  lowStockCount: number;
  totalItems: number;
  totalValue: number;
}

export interface LowStockResponse {
  items: InventoryItem[];
  count: number;
}

class InventoryService {
  /**
   * Get all inventory items
   */
  async getAll(): Promise<InventoryResponse> {
    const response = await apiClient.get<InventoryResponse>('/inventory');
    return response.data;
  }

  /**
   * Get low stock items
   */
  async getLowStock(): Promise<LowStockResponse> {
    const response = await apiClient.get<LowStockResponse>('/inventory/low-stock');
    return response.data;
  }
}

export const inventoryService = new InventoryService();

