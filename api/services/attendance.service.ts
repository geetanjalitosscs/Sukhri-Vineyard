/**
 * Attendance Service
 * Handles all attendance-related API calls
 */

import apiClient from '../config/api.config';

export interface TodayAttendanceResponse {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  total: number;
  biometric: number;
  faceRecognition: number;
  qrCode: number;
}

export interface WeeklyStatsResponse {
  [day: string]: {
    present: number;
    absent: number;
  };
}

export interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  method: string | null;
  deviceId: string | null;
  zone: string | null;
}

class AttendanceService {
  /**
   * Get today's attendance summary
   */
  async getToday(): Promise<TodayAttendanceResponse> {
    const response = await apiClient.get<TodayAttendanceResponse>('/attendance/today');
    return response.data;
  }

  /**
   * Get weekly attendance statistics
   */
  async getWeekly(): Promise<WeeklyStatsResponse> {
    const response = await apiClient.get<WeeklyStatsResponse>('/attendance/weekly');
    return response.data;
  }

  /**
   * Get attendance records
   */
  async getRecords(): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<AttendanceRecord[]>('/attendance/records');
    return response.data;
  }
}

export const attendanceService = new AttendanceService();

