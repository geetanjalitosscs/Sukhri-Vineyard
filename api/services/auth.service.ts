/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import apiClient from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    vineyardId?: string;
    phone?: string;
    status?: string;
  };
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  vineyardId?: string;
  phone?: string;
  status?: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.post<ProfileResponse>('/auth/profile');
    return response.data;
  }
}

export const authService = new AuthService();

