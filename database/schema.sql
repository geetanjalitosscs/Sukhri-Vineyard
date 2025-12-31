-- =====================================================
-- Sukhri Vineyard ERP - PostgreSQL Database Schema
-- =====================================================
-- This file contains all table definitions and demo data
-- =====================================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS file_uploads CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS co2_refill_history CASCADE;
DROP TABLE IF EXISTS co2_barrels CASCADE;
DROP TABLE IF EXISTS temperature_readings CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS vineyards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Vineyards Table
CREATE TABLE vineyards (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    area_hectares DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    vineyard_id VARCHAR(50) REFERENCES vineyards(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('owner', 'admin', 'hr', 'gm', 'vendor', 'staff', 'cleaner', 'caretaker', 'gas-filler'))
);

-- Devices Table (IoT, Cameras, Biometric, Face Recognition)
CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    zone VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    model VARCHAR(100),
    firmware VARCHAR(50),
    vineyard_id VARCHAR(50) REFERENCES vineyards(id) ON DELETE SET NULL,
    barrel_id VARCHAR(50), -- For CO2 sensors linked to barrels
    last_sync TIMESTAMP,
    last_reading TIMESTAMP,
    current_value DECIMAL(10, 2),
    threshold_min DECIMAL(10, 2),
    threshold_max DECIMAL(10, 2),
    alert_enabled BOOLEAN DEFAULT true,
    live_feed_url VARCHAR(500),
    recordings_enabled BOOLEAN DEFAULT false,
    total_scans INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_device_type CHECK (type IN ('temperature', 'co2', 'cctv', 'biometric', 'face', 'qr'))
);

-- =====================================================
-- ATTENDANCE MODULE
-- =====================================================

-- Attendance Records Table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status VARCHAR(50) NOT NULL,
    method VARCHAR(50),
    device_id VARCHAR(50) REFERENCES devices(id) ON DELETE SET NULL,
    zone VARCHAR(100),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_attendance_status CHECK (status IN ('present', 'absent', 'late', 'onLeave', 'earlyExit')),
    CONSTRAINT valid_attendance_method CHECK (method IN ('biometric', 'face', 'qr') OR method IS NULL),
    UNIQUE(user_id, attendance_date)
);

-- =====================================================
-- CO2 BARREL MANAGEMENT
-- =====================================================

-- CO2 Barrels Table
CREATE TABLE co2_barrels (
    id VARCHAR(50) PRIMARY KEY,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    vineyard_id VARCHAR(50) REFERENCES vineyards(id) ON DELETE SET NULL,
    capacity_percentage INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ok',
    last_filled_date DATE,
    next_due_date DATE,
    filled_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    last_fill_time TIMESTAMP,
    sensor_reading INTEGER, -- PPM value
    alert_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_barrel_status CHECK (status IN ('ok', 'overdue', 'low', 'critical')),
    CONSTRAINT valid_capacity CHECK (capacity_percentage >= 0 AND capacity_percentage <= 100)
);

-- CO2 Refill History Table
CREATE TABLE co2_refill_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barrel_id VARCHAR(50) NOT NULL REFERENCES co2_barrels(id) ON DELETE CASCADE,
    filled_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    fill_date DATE NOT NULL,
    fill_time TIMESTAMP NOT NULL,
    capacity_before INTEGER,
    capacity_after INTEGER,
    sensor_reading INTEGER, -- PPM value after fill
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TEMPERATURE & WEATHER MONITORING
-- =====================================================

-- Temperature Readings Table
CREATE TABLE temperature_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(50) NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    reading_time TIMESTAMP NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    humidity DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'normal',
    vineyard_id VARCHAR(50) REFERENCES vineyards(id) ON DELETE SET NULL,
    zone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_temperature_status CHECK (status IN ('normal', 'warning', 'critical'))
);

-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================

-- Inventory Items Table
CREATE TABLE inventory_items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock DECIMAL(10, 2) DEFAULT 0,
    min_stock DECIMAL(10, 2) DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'ok',
    supplier VARCHAR(255),
    last_ordered_date DATE,
    unit_price DECIMAL(10, 2),
    total_value DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_inventory_status CHECK (status IN ('ok', 'low', 'critical', 'out_of_stock'))
);

-- Inventory Transactions Table
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id VARCHAR(50) NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50), -- 'purchase_order', 'co2_usage', 'cleaning', etc.
    reference_id VARCHAR(100),
    performed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_transaction_type CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer'))
);

-- =====================================================
-- VENDOR & PROCUREMENT MANAGEMENT
-- =====================================================

-- Vendors Table
CREATE TABLE vendors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    active_orders INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    on_time_delivery_percentage DECIMAL(5, 2) DEFAULT 0,
    quality_score DECIMAL(3, 2) DEFAULT 0,
    average_response_time_hours INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Link to vendor user account
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_vendor_status CHECK (status IN ('active', 'inactive', 'suspended')),
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Posts/Requests Table
CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    posted_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    posted_by_name VARCHAR(255) NOT NULL,
    posted_by_role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    posted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_post_status CHECK (status IN ('open', 'closed', 'cancelled'))
);

-- Post Requirements Table (Many-to-Many relationship)
CREATE TABLE post_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id VARCHAR(50) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table (Vendor Applications to Posts)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id VARCHAR(50) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    vendor_id VARCHAR(50) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    applied_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    offer TEXT NOT NULL,
    quote_amount VARCHAR(100) NOT NULL,
    additional_details TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_application_status CHECK (status IN ('pending', 'accepted', 'rejected'))
);

-- Purchase Orders Table
CREATE TABLE purchase_orders (
    id VARCHAR(50) PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending_approval',
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    delivery_date DATE,
    requested_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    requested_by_name VARCHAR(255) NOT NULL,
    requested_by_role VARCHAR(50) NOT NULL,
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    invoice_uploaded BOOLEAN DEFAULT false,
    invoice_url VARCHAR(500),
    dispatch_status VARCHAR(50),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_po_status CHECK (status IN ('pending_approval', 'approved', 'rejected', 'dispatched', 'delivered', 'cancelled')),
    CONSTRAINT valid_dispatch_status CHECK (dispatch_status IN ('pending', 'dispatched', 'in_transit', 'delivered') OR dispatch_status IS NULL)
);

-- Purchase Order Items Table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id VARCHAR(50) NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(12, 2),
    inventory_item_id VARCHAR(50) REFERENCES inventory_items(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TASK MANAGEMENT
-- =====================================================

-- Tasks Table
CREATE TABLE tasks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    assigned_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    due_date DATE,
    completed_at TIMESTAMP,
    barrel_id VARCHAR(50) REFERENCES co2_barrels(id) ON DELETE SET NULL,
    zone VARCHAR(100),
    camera_zone VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_task_type CHECK (type IN ('co2_refill', 'cleaning', 'monitoring', 'maintenance', 'other')),
    CONSTRAINT valid_task_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT valid_task_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Task Comments Table
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(50) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- FILE UPLOADS
-- =====================================================

-- File Uploads Table
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    upload_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_vineyard_id ON users(vineyard_id);

-- Attendance indexes
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_user_date ON attendance_records(user_id, attendance_date);

-- CO2 indexes
CREATE INDEX idx_co2_barrels_status ON co2_barrels(status);
CREATE INDEX idx_co2_barrels_next_due ON co2_barrels(next_due_date);
CREATE INDEX idx_co2_refill_barrel_id ON co2_refill_history(barrel_id);

-- Temperature indexes
CREATE INDEX idx_temperature_device_id ON temperature_readings(device_id);
CREATE INDEX idx_temperature_reading_time ON temperature_readings(reading_time);
CREATE INDEX idx_temperature_date ON temperature_readings(reading_time);

-- Inventory indexes
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_inventory_transactions_item_id ON inventory_transactions(item_id);

-- Vendor indexes
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);

-- Purchase Order indexes
CREATE INDEX idx_po_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_requested_by ON purchase_orders(requested_by_user_id);

-- Task indexes
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(type);

-- Device indexes
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_vineyard_id ON devices(vineyard_id);

-- Application indexes
CREATE INDEX idx_applications_post_id ON applications(post_id);
CREATE INDEX idx_applications_vendor_id ON applications(vendor_id);
CREATE INDEX idx_applications_status ON applications(status);

-- File upload indexes
CREATE INDEX idx_file_uploads_client_email ON file_uploads(client_email);
CREATE INDEX idx_file_uploads_upload_time ON file_uploads(upload_time);

-- =====================================================
-- DEMO DATA INSERTION
-- =====================================================

-- Begin transaction for data insertion
BEGIN;

-- Insert Vineyards
INSERT INTO vineyards (id, name, location, area_hectares, status) VALUES
('all', 'All Vineyards', 'Multiple Locations', 0, 'active'),
('sukhri', 'Sukhri Vineyard', 'Nashik, Maharashtra', 25.5, 'active'),
('future1', 'Future Farm 1', 'Pune, Maharashtra', 15.0, 'active'),
('future2', 'Future Farm 2', 'Sangli, Maharashtra', 20.0, 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert Users (passwords are hashed 'Admin@123' using bcrypt)
-- Note: In production, use bcrypt to hash passwords. For demo, using placeholder hashes
-- Using a proper bcrypt hash for 'Admin@123' - this is a real hash that will work
INSERT INTO users (id, email, password, name, role, vineyard_id, phone, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'owner@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vineyard Owner', 'owner', 'all', '+91 98765 43201', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'hr@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HR Manager', 'hr', 'sukhri', '+91 98765 43202', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'admin@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', 'admin', 'sukhri', '+91 98765 43203', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'gm@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'General Manager', 'gm', 'sukhri', '+91 98765 43204', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'vendor@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Vendor Partner', 'vendor', NULL, '+91 98765 43205', 'active'),
('550e8400-e29b-41d4-a716-446655440006', 'vendor@agrisupply.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Agri Supply Vendor', 'vendor', NULL, '+91 98765 43206', 'active'),
('550e8400-e29b-41d4-a716-446655440007', 'cleaner@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Cleaner', 'cleaner', 'sukhri', '+91 98765 43207', 'active'),
('550e8400-e29b-41d4-a716-446655440008', 'caretaker@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sarah Caretaker', 'caretaker', 'sukhri', '+91 98765 43208', 'active'),
('550e8400-e29b-41d4-a716-446655440009', 'gasfiller@sukrivineyard.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mike Gas Filler', 'gas-filler', 'sukhri', '+91 98765 43209', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert Devices
INSERT INTO devices (id, name, type, location, zone, status, model, firmware, vineyard_id, last_sync, last_reading, current_value, threshold_min, threshold_max, alert_enabled) VALUES
('TEMP-001', 'Temperature Sensor Block A', 'temperature', 'Block A - Center', 'Block A', 'active', 'DS18B20', 'v2.1.0', 'sukhri', '2024-01-17 10:00:00', '2024-01-17 10:00:00', 24.8, 18.0, 28.0, true),
('TEMP-002', 'Temperature Sensor Block B', 'temperature', 'Block B - Center', 'Block B', 'active', 'DS18B20', 'v2.1.0', 'sukhri', '2024-01-17 10:00:00', '2024-01-17 10:00:00', 25.2, 18.0, 28.0, true),
('CO2-SENSOR-001', 'CO₂ Sensor Barrel CO2-003', 'co2', 'Block B - Row 3', 'Block B', 'active', 'MH-Z19', 'v1.5.0', 'sukhri', '2024-01-17 10:00:00', '2024-01-17 10:00:00', 800, 3000, 5000, true),
('CAM-001', 'Camera Block A', 'cctv', 'Block A - Main Zone', 'Block A', 'active', 'Hikvision DS-2CD', 'v5.7.0', 'sukhri', '2024-01-17 10:00:00', NULL, NULL, NULL, NULL, true),
('CAM-002', 'Camera Block B', 'cctv', 'Block B - Main Zone', 'Block B', 'active', 'Hikvision DS-2CD', 'v5.7.0', 'sukhri', '2024-01-17 10:00:00', NULL, NULL, NULL, NULL, true),
('CAM-003', 'Camera CO₂ Storage', 'cctv', 'CO₂ Storage Area', 'CO₂ Storage', 'active', 'Hikvision DS-2CD', 'v5.7.0', 'sukhri', '2024-01-17 10:00:00', NULL, NULL, NULL, NULL, true),
('BIO-001', 'Biometric Machine 1', 'biometric', 'Main Gate', 'Main Gate', 'active', 'ZKTeco K40', 'v6.0.0', 'sukhri', '2024-01-17 08:30:00', NULL, NULL, NULL, NULL, true),
('FACE-001', 'Face Recognition Device 1', 'face', 'Quality Control', 'Quality Control', 'active', 'Hikvision Face Recognition', 'v4.1.0', 'sukhri', '2024-01-17 08:15:00', NULL, NULL, NULL, NULL, true),
('FACE-002', 'Face Recognition Device 2', 'face', 'Block B Entrance', 'Block B', 'active', 'Hikvision Face Recognition', 'v4.1.0', 'sukhri', '2024-01-17 07:50:00', NULL, NULL, NULL, NULL, true)
ON CONFLICT (id) DO NOTHING;

UPDATE devices SET live_feed_url = '/cameras/cam-001/live', recordings_enabled = true WHERE id LIKE 'CAM-%';
UPDATE devices SET total_scans = 28 WHERE id = 'BIO-001';
UPDATE devices SET total_scans = 12 WHERE id = 'FACE-001';
UPDATE devices SET total_scans = 8 WHERE id = 'FACE-002';
UPDATE devices SET barrel_id = 'CO2-003' WHERE id = 'CO2-SENSOR-001';

-- Insert CO2 Barrels
INSERT INTO co2_barrels (id, qr_code, location, vineyard_id, capacity_percentage, status, last_filled_date, next_due_date, filled_by_user_id, last_fill_time, sensor_reading, alert_sent) VALUES
('CO2-001', 'QR-CO2-001-ABC123', 'Block A - Row 5', 'sukhri', 85, 'ok', '2024-01-15', '2024-01-22', '550e8400-e29b-41d4-a716-446655440009', '2024-01-15 10:30:00', 4200, false),
('CO2-002', 'QR-CO2-002-DEF456', 'Block A - Row 8', 'sukhri', 90, 'ok', '2024-01-14', '2024-01-21', '550e8400-e29b-41d4-a716-446655440009', '2024-01-14 09:15:00', 4500, false),
('CO2-003', 'QR-CO2-003-GHI789', 'Block B - Row 3', 'sukhri', 15, 'overdue', '2024-01-10', '2024-01-17', NULL, NULL, 800, true),
('CO2-004', 'QR-CO2-004-JKL012', 'Block B - Row 7', 'sukhri', 75, 'ok', '2024-01-16', '2024-01-23', '550e8400-e29b-41d4-a716-446655440009', '2024-01-16 11:00:00', 3800, false),
('CO2-005', 'QR-CO2-005-MNO345', 'Block C - Row 2', 'sukhri', 20, 'overdue', '2024-01-09', '2024-01-16', NULL, NULL, 1000, true),
('CO2-006', 'QR-CO2-006-PQR678', 'Block C - Row 9', 'sukhri', 88, 'ok', '2024-01-17', '2024-01-24', '550e8400-e29b-41d4-a716-446655440009', '2024-01-17 08:45:00', 4400, false)
ON CONFLICT (id) DO NOTHING;

-- Insert CO2 Refill History
INSERT INTO co2_refill_history (barrel_id, filled_by_user_id, fill_date, fill_time, capacity_before, capacity_after, sensor_reading) VALUES
('CO2-001', '550e8400-e29b-41d4-a716-446655440009', '2024-01-15', '2024-01-15 10:30:00', 20, 85, 4200),
('CO2-002', '550e8400-e29b-41d4-a716-446655440009', '2024-01-14', '2024-01-14 09:15:00', 15, 90, 4500),
('CO2-004', '550e8400-e29b-41d4-a716-446655440009', '2024-01-16', '2024-01-16 11:00:00', 30, 75, 3800),
('CO2-006', '550e8400-e29b-41d4-a716-446655440009', '2024-01-17', '2024-01-17 08:45:00', 25, 88, 4400);

-- Insert Temperature Readings
INSERT INTO temperature_readings (device_id, reading_time, temperature, humidity, status, vineyard_id, zone) VALUES
('TEMP-001', '2024-01-17 07:00:00', 18.5, 65, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 08:00:00', 20.2, 68, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 09:00:00', 22.8, 70, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 10:00:00', 25.3, 72, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 11:00:00', 27.1, 75, 'warning', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 12:00:00', 28.5, 78, 'warning', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 13:00:00', 29.2, 80, 'warning', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 14:00:00', 30.1, 82, 'critical', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 15:00:00', 29.8, 81, 'warning', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 16:00:00', 28.3, 79, 'warning', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 17:00:00', 26.5, 76, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 18:00:00', 24.2, 73, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 19:00:00', 22.1, 70, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 20:00:00', 20.5, 68, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 21:00:00', 19.2, 66, 'normal', 'sukhri', 'Block A'),
('TEMP-001', '2024-01-17 22:00:00', 18.8, 65, 'normal', 'sukhri', 'Block A');

-- Insert Inventory Items
INSERT INTO inventory_items (id, name, category, current_stock, min_stock, unit, status, supplier, last_ordered_date, unit_price, total_value) VALUES
('INV-001', 'Fertilizer NPK 20-20-20', 'Fertilizer', 45, 100, 'kg', 'low', 'AgriSupply Co.', '2024-01-10', 450.00, 20250.00),
('INV-002', 'Pesticide - Organic', 'Pesticide', 25, 50, 'liters', 'low', 'GreenTech Solutions', '2024-01-12', 1200.00, 30000.00),
('INV-003', 'Pruning Shears', 'Tools', 15, 20, 'pieces', 'low', 'ToolMaster Inc.', '2024-01-08', 850.00, 12750.00),
('INV-004', 'Irrigation Pipes', 'Equipment', 200, 150, 'meters', 'ok', 'Irrigation Pro', '2024-01-05', 120.00, 24000.00),
('INV-005', 'Vine Support Stakes', 'Equipment', 500, 300, 'pieces', 'ok', 'Vineyard Supplies', '2024-01-03', 45.00, 22500.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Vendors
INSERT INTO vendors (id, name, contact_email, phone, rating, total_orders, active_orders, status, on_time_delivery_percentage, quality_score, average_response_time_hours, user_id) VALUES
('V-001', 'AgriSupply Co.', 'contact@agrisupply.com', '+91 98765 43210', 4.5, 45, 3, 'active', 92.0, 4.3, 24, '550e8400-e29b-41d4-a716-446655440005'),
('V-002', 'GreenTech Solutions', 'info@greentech.com', '+91 98765 43211', 4.8, 32, 2, 'active', 96.0, 4.7, 18, NULL),
('V-003', 'ToolMaster Inc.', 'sales@toolmaster.com', '+91 98765 43212', 4.2, 28, 1, 'active', 88.0, 4.1, 30, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Posts
INSERT INTO posts (id, title, content, posted_by_user_id, posted_by_name, posted_by_role, status, posted_at) VALUES
('POST-001', 'Urgent Requirement: Organic Fertilizer Supply', 'We require 500 kg of organic NPK fertilizer for our vineyard operations. The fertilizer should be certified organic and suitable for grape cultivation. We need this delivered within 2 weeks. Please provide your best quote with delivery timeline.', '550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'owner', 'open', '2024-01-20 10:30:00'),
('POST-002', 'Equipment Maintenance Services Needed', 'We require a regular maintenance services for our vineyard equipment including pruning machines, irrigation systems, and temperature monitoring devices. This would be a monthly service contract. We need someone who can respond quickly to emergency repairs.', '550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'hr', 'open', '2024-01-19 14:15:00'),
('POST-003', 'CO₂ Refilling Service Required', 'We need regular CO₂ barrel refilling services. We have 10 barrels that need to be refilled monthly. The vendor should have proper safety certifications and be able to handle bulk refilling operations. We prefer a long-term contract with competitive pricing.', '550e8400-e29b-41d4-a716-446655440004', 'Amit Patel', 'gm', 'open', '2024-01-18 09:00:00'),
('POST-004', 'Pesticide and Organic Spray Solutions', 'We require organic pesticide solutions for pest control in our vineyard. The products should be environmentally friendly and approved for organic farming. We need approximately 200 liters per month. Vendor should provide application guidance and safety training.', '550e8400-e29b-41d4-a716-446655440003', 'Sneha Reddy', 'admin', 'open', '2024-01-17 16:45:00'),
('POST-005', 'Harvesting Tools and Equipment', 'We need to purchase new harvesting tools including pruning shears, grape picking baskets, and quality control equipment. The tools should be durable and suitable for commercial vineyard operations. We need 50 sets of each tool.', '550e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', 'owner', 'open', '2024-01-16 11:20:00')
ON CONFLICT (id) DO NOTHING;

-- Insert Post Requirements
INSERT INTO post_requirements (post_id, requirement) VALUES
('POST-001', '500 kg organic NPK fertilizer'),
('POST-001', 'Certified organic certification required'),
('POST-001', 'Delivery within 2 weeks'),
('POST-001', 'Suitable for grape cultivation'),
('POST-002', 'Monthly maintenance contract'),
('POST-002', 'Equipment: pruning machines, irrigation systems, temperature sensors'),
('POST-002', '24/7 emergency support'),
('POST-002', 'Experienced technicians'),
('POST-003', 'Monthly CO₂ refilling for 10 barrels'),
('POST-003', 'Safety certifications required'),
('POST-003', 'Bulk refilling capability'),
('POST-003', 'Long-term contract preferred'),
('POST-004', '200 liters organic pesticide monthly'),
('POST-004', 'Organic farming certified'),
('POST-004', 'Application guidance required'),
('POST-004', 'Safety training for staff'),
('POST-005', '50 sets of pruning shears'),
('POST-005', '50 grape picking baskets'),
('POST-005', 'Quality control equipment'),
('POST-005', 'Commercial grade durability');

-- Insert Applications
INSERT INTO applications (post_id, vendor_id, applied_by_user_id, offer, quote_amount, additional_details, status, applied_at) VALUES
('POST-001', 'V-001', '550e8400-e29b-41d4-a716-446655440005', 'I can provide 500 kg of certified organic NPK fertilizer suitable for grape cultivation. I have all necessary certifications and can deliver within 1 week.', '₹47,000', 'I have 500 kg available in stock. I can deliver within 1 week. I have all necessary certifications.', 'pending', '2024-01-20 11:00:00'),
('POST-003', 'V-001', '550e8400-e29b-41d4-a716-446655440005', 'I can provide monthly CO₂ refilling services for 10 barrels. I have all safety certifications and 5 years of experience in bulk refilling operations.', '₹9,000 per month', 'I have all safety certifications and 5 years of experience in bulk refilling operations.', 'accepted', '2024-01-18 10:00:00'),
('POST-002', 'V-003', NULL, 'We provide comprehensive maintenance services for vineyard equipment. Our team has 10+ years of experience and we offer 24/7 emergency support.', '₹18,000 per month', 'We have 10+ years of experience and offer 24/7 emergency support.', 'rejected', '2024-01-19 15:00:00');

-- Insert Purchase Orders
INSERT INTO purchase_orders (id, vendor_id, status, order_date, expected_delivery_date, delivery_date, requested_by_user_id, requested_by_name, requested_by_role, approved_by_user_id, approved_at, invoice_uploaded, invoice_url, dispatch_status, total_amount) VALUES
('PO-2024-001', 'V-001', 'pending_approval', '2024-01-15', '2024-01-20', NULL, '550e8400-e29b-41d4-a716-446655440004', 'General Manager', 'gm', NULL, NULL, false, NULL, NULL, 67500.00),
('PO-2024-002', 'V-002', 'approved', '2024-01-16', '2024-01-22', NULL, '550e8400-e29b-41d4-a716-446655440004', 'General Manager', 'gm', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16 10:30:00', false, NULL, 'pending', 36000.00),
('PO-2024-003', 'V-003', 'delivered', '2024-01-10', '2024-01-15', '2024-01-14', '550e8400-e29b-41d4-a716-446655440004', 'General Manager', 'gm', '550e8400-e29b-41d4-a716-446655440001', '2024-01-10 14:00:00', true, '/invoices/PO-2024-003.pdf', 'delivered', 12750.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Purchase Order Items
INSERT INTO purchase_order_items (purchase_order_id, item_name, quantity, unit, unit_price, total_price, inventory_item_id) VALUES
('PO-2024-001', 'Fertilizer NPK 20-20-20', 100, 'kg', 450.00, 45000.00, 'INV-001'),
('PO-2024-001', 'Organic Compost', 50, 'bags', 450.00, 22500.00, NULL),
('PO-2024-002', 'Pesticide - Organic', 30, 'liters', 1200.00, 36000.00, 'INV-002'),
('PO-2024-003', 'Pruning Shears', 10, 'pieces', 850.00, 8500.00, 'INV-003'),
('PO-2024-003', 'Garden Tools Set', 5, 'sets', 850.00, 4250.00, NULL);

-- Insert Tasks
INSERT INTO tasks (id, title, type, assigned_to_user_id, assigned_to_name, status, priority, due_date, barrel_id, zone, camera_zone, location, created_by_user_id, created_at) VALUES
('TASK-001', 'Refill CO₂ Barrel CO2-003', 'co2_refill', '550e8400-e29b-41d4-a716-446655440009', 'Mike Gas Filler', 'pending', 'high', '2024-01-17', 'CO2-003', NULL, NULL, 'Block B - Row 3', '550e8400-e29b-41d4-a716-446655440004', '2024-01-16 08:00:00'),
('TASK-002', 'Refill CO₂ Barrel CO2-005', 'co2_refill', '550e8400-e29b-41d4-a716-446655440009', 'Mike Gas Filler', 'pending', 'high', '2024-01-16', 'CO2-005', NULL, NULL, 'Block C - Row 2', '550e8400-e29b-41d4-a716-446655440004', '2024-01-15 14:30:00'),
('TASK-003', 'Clean Block A - Row 1-5', 'cleaning', '550e8400-e29b-41d4-a716-446655440007', 'John Cleaner', 'in_progress', 'medium', '2024-01-17', NULL, 'Block A', 'CAM-001', 'Block A - Row 1-5', '550e8400-e29b-41d4-a716-446655440004', '2024-01-17 07:00:00'),
('TASK-004', 'Temperature Check - Block B', 'monitoring', '550e8400-e29b-41d4-a716-446655440008', 'Sarah Caretaker', 'completed', 'low', '2024-01-17', NULL, 'Block B', NULL, 'Block B', '550e8400-e29b-41d4-a716-446655440004', '2024-01-17 08:00:00')
ON CONFLICT (id) DO NOTHING;

UPDATE tasks SET completed_at = '2024-01-17 09:30:00' WHERE id = 'TASK-004';

-- Insert Attendance Records
INSERT INTO attendance_records (user_id, attendance_date, check_in_time, check_out_time, status, method, device_id, zone) VALUES
('550e8400-e29b-41d4-a716-446655440007', '2024-01-17', '08:15:00', '17:30:00', 'present', 'biometric', 'BIO-001', 'Block A'),
('550e8400-e29b-41d4-a716-446655440008', '2024-01-17', '07:45:00', NULL, 'present', 'face', 'FACE-002', 'Block B'),
('550e8400-e29b-41d4-a716-446655440009', '2024-01-17', '08:30:00', NULL, 'late', 'biometric', 'BIO-001', 'CO₂ Storage'),
('550e8400-e29b-41d4-a716-446655440007', '2024-01-16', '08:00:00', '17:00:00', 'present', 'biometric', 'BIO-001', 'Block A'),
('550e8400-e29b-41d4-a716-446655440008', '2024-01-16', '07:30:00', '16:45:00', 'present', 'face', 'FACE-002', 'Block B'),
('550e8400-e29b-41d4-a716-446655440009', '2024-01-16', '08:00:00', '17:00:00', 'present', 'biometric', 'BIO-001', 'CO₂ Storage');

-- Insert File Uploads (Demo)
INSERT INTO file_uploads (client_name, client_email, file_name, file_path, file_size, file_type, uploaded_by_user_id, upload_time, email_sent, email_sent_at) VALUES
('John Doe', 'john.doe@example.com', 'vineyard_report_2024.pdf', '/uploads/vineyard_report_2024.pdf', 2048576, 'application/pdf', '550e8400-e29b-41d4-a716-446655440001', '2024-01-17 10:00:00', true, '2024-01-17 10:00:05'),
('Jane Smith', 'jane.smith@example.com', 'inventory_list.xlsx', '/uploads/inventory_list.xlsx', 512000, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '550e8400-e29b-41d4-a716-446655440004', '2024-01-17 11:30:00', true, '2024-01-17 11:30:05');

-- Commit transaction
COMMIT;

-- =====================================================
-- END OF SCHEMA AND DATA
-- =====================================================

