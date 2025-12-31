/**
 * Users Service
 * Handles all user-related API calls
 */

import apiClient from '../config/api.config';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  vineyardId?: string;
  phone?: string;
  status?: string;
  createdByUserId?: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: string;
  vineyardId?: string;
  phone?: string;
  createdBy?: string;
}

class UsersService {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/users', userData);
    return response.data;
  }
}

export const usersService = new UsersService();

