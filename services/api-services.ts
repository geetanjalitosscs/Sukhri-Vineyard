import api from './api';

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.post('/auth/profile');
    return response.data;
  },
};

// Attendance API
export const attendanceApi = {
  getToday: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },
  getWeekly: async () => {
    const response = await api.get('/attendance/weekly');
    return response.data;
  },
  getRecords: async () => {
    const response = await api.get('/attendance/records');
    return response.data;
  },
};

// CO2 API
export const co2Api = {
  getBarrels: async () => {
    const response = await api.get('/co2/barrels');
    return response.data;
  },
  getOverdue: async () => {
    const response = await api.get('/co2/overdue');
    return response.data;
  },
  getWeeklyCompletion: async () => {
    // Calculate from barrels data
    const barrels = await api.get('/co2/barrels');
    const overdue = await api.get('/co2/overdue');
    const total = barrels.data.length;
    const completed = total - overdue.data.count;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  },
};

// Inventory API
export const inventoryApi = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },
};

// Temperature API
export const temperatureApi = {
  getReadings: async (deviceId?: string) => {
    const params = deviceId ? { deviceId } : {};
    const response = await api.get('/temperature/readings', { params });
    return response.data;
  },
  getStats: async (deviceId?: string) => {
    const params = deviceId ? { deviceId } : {};
    const response = await api.get('/temperature/stats', { params });
    return response.data;
  },
};

// Vendors API
export const vendorsApi = {
  getAll: async () => {
    const response = await api.get('/vendors');
    return response.data;
  },
  getPurchaseOrders: async () => {
    const response = await api.get('/vendors/purchase-orders');
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

