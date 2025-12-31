/**
 * Devices Service
 * Handles all device-related API calls
 */

import apiClient from '../config/api.config';

export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  zone: string;
  status: string;
  lastSync?: string;
  liveFeedUrl?: string;
  recordingsEnabled?: boolean;
}

export interface DevicesResponse {
  iotDevices: Device[];
  cameras: Device[];
  attendanceDevices: Device[];
}

class DevicesService {
  /**
   * Get all devices
   */
  async getAll(): Promise<DevicesResponse> {
    const response = await apiClient.get<DevicesResponse>('/devices');
    return response.data;
  }

  /**
   * Get all devices as a flat array (for backward compatibility)
   */
  async getAllAsArray(): Promise<Device[]> {
    const response = await apiClient.get<DevicesResponse>('/devices');
    const data = response.data;
    return [
      ...(data.iotDevices || []),
      ...(data.cameras || []),
      ...(data.attendanceDevices || []),
    ];
  }

  /**
   * Get cameras only
   */
  async getCameras(): Promise<Device[]> {
    const response = await apiClient.get<Device[]>('/devices/cameras');
    return response.data;
  }
}

export const devicesService = new DevicesService();

