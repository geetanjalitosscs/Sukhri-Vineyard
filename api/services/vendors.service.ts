/**
 * Vendors Service
 * Handles all vendor and procurement-related API calls
 */

import apiClient from '../config/api.config';

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  rating: number;
  totalOrders: number;
  activeOrders: number;
  status: string;
  performance: {
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
  };
}

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  vendorId: string | null;
  items: PurchaseOrderItem[];
  status: string;
  orderDate: string;
  expectedDelivery: string | null;
  deliveryDate: string | null;
  requestedBy?: string;
  requestedByName?: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  invoiceUploaded?: boolean;
  invoiceUrl?: string | null;
  dispatchStatus?: string;
}

export interface PurchaseOrdersResponse {
  purchaseOrders: PurchaseOrder[];
  activeVendors: number;
  openPOs: number;
  closedPOs: number;
  pendingApprovals?: number;
}

class VendorsService {
  /**
   * Get all vendors
   */
  async getAll(): Promise<Vendor[]> {
    const response = await apiClient.get<Vendor[]>('/vendors');
    return response.data;
  }

  /**
   * Get purchase orders
   */
  async getPurchaseOrders(): Promise<PurchaseOrdersResponse> {
    const response = await apiClient.get<PurchaseOrdersResponse>('/vendors/purchase-orders');
    return response.data;
  }
}

export const vendorsService = new VendorsService();

