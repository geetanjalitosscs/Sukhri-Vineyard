/**
 * Salary Service
 * Handles all salary-related API calls
 */

import apiClient from '../config/api.config';

export interface SalaryRecord {
  id: string;
  userId: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  recordedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

class SalaryService {
  /**
   * Create a new salary record
   */
  async create(salaryData: {
    userId: string;
    month: string;
    baseSalary: number;
    allowances?: number;
    deductions?: number;
    recordedByUserId?: string;
  }): Promise<SalaryRecord> {
    const response = await apiClient.post<SalaryRecord>('/salary', salaryData);
    return response.data;
  }

  /**
   * Get all salary records
   */
  async getAll(): Promise<SalaryRecord[]> {
    const response = await apiClient.get<SalaryRecord[]>('/salary');
    return response.data;
  }

  /**
   * Get salary records for a specific user
   */
  async getByUser(userId: string): Promise<SalaryRecord[]> {
    const response = await apiClient.get<SalaryRecord[]>(`/salary/user/${userId}`);
    return response.data;
  }
}

export const salaryService = new SalaryService();

