/**
 * API Configuration
 * 
 * This is the ONLY place where you need to change the API URL when hosting.
 * Change NEXT_PUBLIC_API_URL in .env.local or update the default value below.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

// ============================================
// API BASE URL CONFIGURATION
// ============================================
// Change this URL when deploying to production
// Option 1: Set NEXT_PUBLIC_API_URL in .env.local
// Option 2: Update the default value below
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================
const createApiInstance = (): AxiosInstance => {
  // Append /api to the base URL since backend uses /api prefix
  const baseURL = API_BASE_URL.endsWith('/api') 
    ? API_BASE_URL 
    : `${API_BASE_URL}/api`;
  
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor - Add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized - Only logout on actual authentication failures
      if (error.response?.status === 401) {
        const authStore = useAuthStore.getState();
        const token = authStore.token;
        const requestUrl = error.config?.url || '';
        
        // Only logout if:
        // 1. We have a token (means we were logged in)
        // 2. It's NOT the login endpoint (avoid logout on login failure)
        // 3. It's a protected endpoint (not a public endpoint)
        if (token && 
            !requestUrl.includes('/auth/login') && 
            error.response &&
            !requestUrl.includes('/temperature') && // Temperature endpoint is public for now
            typeof window !== 'undefined' && 
            !window.location.pathname.includes('/login')) {
          
          // Check error message to confirm it's an auth error
          const errorData = error.response.data as any;
          const errorMessage = errorData?.message || errorData?.error || '';
          
          // Only logout on clear authentication errors
          if (errorMessage.includes('Unauthorized') || 
              errorMessage.includes('token') || 
              errorMessage.includes('jwt') ||
              errorMessage.includes('authentication')) {
            console.warn('Authentication failed, logging out...', errorMessage);
            authStore.logout();
            // Small delay to avoid redirect loops
            setTimeout(() => {
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
            }, 100);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the configured axios instance
export const apiClient = createApiInstance();

// Export API URL for reference
export default apiClient;

