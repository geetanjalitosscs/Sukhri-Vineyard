/**
 * CO2 Service
 * Handles all CO2 management-related API calls
 */

import apiClient from '../config/api.config';

export interface Co2Barrel {
  id: string;
  qrCode: string;
  lastFilled: string | null;
  nextDue: string | null;
  status: string;
  capacity: number;
  location: string;
  sensorReading?: number | null;
  filledBy?: string | null;
  fillTime?: string | null;
  alertSent?: boolean;
}

export interface OverdueResponse {
  barrels: Co2Barrel[];
  count: number;
}

class Co2Service {
  /**
   * Get all CO2 barrels
   */
  async getBarrels(): Promise<Co2Barrel[]> {
    const response = await apiClient.get<Co2Barrel[]>('/co2/barrels');
    return response.data;
  }

  /**
   * Get overdue CO2 barrels
   */
  async getOverdue(): Promise<OverdueResponse> {
    const response = await apiClient.get<OverdueResponse>('/co2/overdue');
    return response.data;
  }

  /**
   * Calculate weekly completion percentage
   */
  async getWeeklyCompletion(): Promise<number> {
    try {
      const [barrels, overdue] = await Promise.all([
        this.getBarrels(),
        this.getOverdue(),
      ]);
      const total = barrels.length;
      const completed = total - overdue.count;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    } catch (error) {
      console.error('Error calculating weekly completion:', error);
      return 0;
    }
  }
}

export const co2Service = new Co2Service();

