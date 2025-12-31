/**
 * DEMO MODE: Fallback data when database is empty or API fails
 * Safe for production demo - only used when API returns empty/error
 */

export const DEMO_TEMPERATURE_READINGS = [
  { time: '08:00', temperature: 22.5, humidity: 65, status: 'ok' },
  { time: '09:00', temperature: 24.1, humidity: 62, status: 'ok' },
  { time: '10:00', temperature: 26.3, humidity: 58, status: 'ok' },
  { time: '11:00', temperature: 28.7, humidity: 55, status: 'ok' },
  { time: '12:00', temperature: 30.2, humidity: 52, status: 'ok' },
  { time: '13:00', temperature: 31.5, humidity: 50, status: 'ok' },
  { time: '14:00', temperature: 30.8, humidity: 51, status: 'ok' },
  { time: '15:00', temperature: 29.2, humidity: 54, status: 'ok' },
];

export const DEMO_TEMPERATURE_STATS = {
  average: 27.9,
  max: 31.5,
  min: 22.5,
  alerts: 0,
};

export const DEMO_CO2_BARRELS = [
  {
    id: 'CO2-001',
    qrCode: 'QR-CO2-001-ABC123',
    lastFilled: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextDue: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 75,
    location: 'Vineyard Zone A',
    status: 'ok',
  },
  {
    id: 'CO2-002',
    qrCode: 'QR-CO2-002-DEF456',
    lastFilled: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    nextDue: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 25,
    location: 'Vineyard Zone B',
    status: 'overdue',
  },
];

export const DEMO_ATTENDANCE_TODAY = {
  present: 12,
  absent: 3,
  late: 2,
  onLeave: 1,
  total: 18,
  biometric: 8,
  faceRecognition: 3,
  qrCode: 1,
};

export const DEMO_ATTENDANCE_RECORDS = [
  {
    id: 'att-1',
    name: 'John Doe',
    role: 'caretaker',
    checkIn: '08:15',
    checkOut: null,
    status: 'present',
    method: 'biometric',
  },
  {
    id: 'att-2',
    name: 'Jane Smith',
    role: 'staff',
    checkIn: '08:30',
    checkOut: null,
    status: 'present',
    method: 'qrCode',
  },
  {
    id: 'att-3',
    name: 'Mike Johnson',
    role: 'cleaner',
    checkIn: '09:00',
    checkOut: null,
    status: 'late',
    method: 'faceRecognition',
  },
];

export const DEMO_INVENTORY_ITEMS = [
  {
    id: 'inv-1',
    name: 'Fertilizer NPK 20-20-20',
    category: 'Fertilizer',
    currentStock: 45,
    minStock: 50,
    unit: 'kg',
    status: 'low',
    supplier: 'AgriSupply Co.',
  },
  {
    id: 'inv-2',
    name: 'Irrigation Pipes',
    category: 'Equipment',
    currentStock: 150,
    minStock: 100,
    unit: 'meters',
    status: 'ok',
    supplier: 'Irrigation Pro',
  },
  {
    id: 'inv-3',
    name: 'Pesticide - Organic',
    category: 'Pesticide',
    currentStock: 25,
    minStock: 50,
    unit: 'liters',
    status: 'low',
    supplier: 'GreenTech Solutions',
  },
];

export const DEMO_VENDORS = [
  {
    id: 'ven-1',
    name: 'AgriSupply Co.',
    contact: 'contact@agrisupply.com',
    status: 'active',
  },
];

export const DEMO_PURCHASE_ORDERS = [
  {
    id: 'PO-2024-001',
    vendor: 'AgriSupply Co.',
    items: ['Fertilizer NPK 20-20-20', 'Organic Pesticide'],
    status: 'pending_approval',
    requestedBy: 'owner-id',
    requestedByName: 'Vineyard Owner',
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Check if data is empty and return demo data if needed
 */
export function getDemoDataIfEmpty<T>(data: T | null | undefined, demoData: T): T {
  if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return demoData;
  }
  return data;
}


