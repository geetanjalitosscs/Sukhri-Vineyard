/**
 * Temperature Service
 * Handles all temperature monitoring-related API calls
 */

import apiClient from '../config/api.config';

export interface TemperatureReading {
  time: string;
  temperature: number;
  humidity: number | null;
  status: string;
}

export interface TemperatureStats {
  average: number;
  max: number;
  min: number;
  alerts: number;
}

class TemperatureService {
  /**
   * Get temperature readings
   * @param deviceId Optional device ID to filter readings
   */
  async getReadings(deviceId?: string): Promise<TemperatureReading[]> {
    const params = deviceId ? { deviceId } : {};
    const response = await apiClient.get<TemperatureReading[]>('/temperature/readings', { params });
    return response.data;
  }

  /**
   * Get temperature statistics
   * @param deviceId Optional device ID to filter stats
   */
  async getStats(deviceId?: string): Promise<TemperatureStats> {
    const params = deviceId ? { deviceId } : {};
    const response = await apiClient.get<TemperatureStats>('/temperature/stats', { params });
    return response.data;
  }
}

export const temperatureService = new TemperatureService();

