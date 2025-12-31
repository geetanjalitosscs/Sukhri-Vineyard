# Sukhri Vineyard – End-to-End Application

A comprehensive, enterprise-grade Smart ERP dashboard for Sukhri Vineyard operations with IoT & AI integration. This is a Web + Mobile first ERP platform for vineyard operations with IoT & AI capabilities.

## 🎯 Overview

The Sukhri Vineyard system provides role-based dashboards, IoT integrations, QR & biometric attendance, CO₂ barrel workflow, camera monitoring, vendor & inventory management, and AI assistant (TOAI).

## 🚀 Features

### Core Capabilities
- **Role-Based Access Control (RBAC)** - Secure access for Owner, Admin, HR, GM, Staff, and Vendors
- **IoT Integration** - Temperature sensors, CO₂ sensors, and device management
- **Multi-Method Attendance** - Biometric, Face Recognition, and QR Code attendance
- **CO₂ Barrel Management** - QR-based refill tracking with sensor validation
- **Camera Monitoring** - Live and recorded feeds for staff accountability
- **Inventory Management** - Auto-updates, threshold alerts, and purchase workflows
- **Vendor Portal** - Limited access portal for purchase orders and deliveries
- **AI Assistant (TOAI)** - Real-time ERP data insights and alerts

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** (React) with TypeScript
- **Tailwind CSS** for styling
- **ShadCN UI** for components
- **Recharts** for data visualization
- **Lucide Icons** for iconography
- **Zustand** for state management
- **next-themes** for dark/light mode

### Backend
- **NestJS** (Node.js) with TypeScript
- **REST APIs** for all endpoints
- **JWT** for authentication
- **RBAC** for authorization

### Database & Cache
- **PostgreSQL** for primary data storage
- **Redis** for caching (planned)

### Architecture
- **MVC Pattern** - Clean separation of concerns
- **Modular Folder Structure** - Organized and maintainable
- **TypeScript** - Type-safe development

## 👥 User Roles

### Owner (Super Admin)
- Full access to all modules
- Purchase order approvals
- Aggregated dashboard view
- TOAI AI assistant access
- Reports and exports

### Admin
- Master data management
- Device & camera mapping
- User & role creation (HR, GM, Staff, Cleaner, Caretaker, Gas Filler)
- System configuration
- Device registration (IoT, cameras, biometric)

### HR Manager
- Attendance management (biometric/face/QR)
- Staff list and profiles
- Leave management
- Attendance reports
- Salary inputs

### General Manager (GM)
- Operations control
- Temperature monitoring
- CO₂ compliance tracking
- Inventory alerts
- Task assignment
- Staff task status
- Note: Cannot create users (view-only access to user management)

### Staff Roles
- **Cleaner** - Cleaning tasks, attendance via biometric/face/QR
- **Caretaker** - Vineyard care, temperature monitoring
- **Gas Filler (CO₂ Manager)** - CO₂ barrel refills, QR scanning

### Vendor
- Limited portal access
- Purchase order viewing
- Delivery status updates
- Invoice upload
- Dispatch management

## 🔐 Authentication Methods

### Email/Password Login
- Available for: Owner, Admin, HR, GM, Vendor
- Standard email and password authentication

### Biometric Login
- Available for: Staff (Cleaner, Caretaker, Gas Filler)
- Fingerprint scanning via biometric devices
- Device sync required

### Face Recognition Login
- Available for: Staff
- Face recognition via camera devices
- Device sync required

## 📊 System Flows

### 1. System Entry Point (Login & Role Detection)

**Flow:**
1. User opens Web App / Mobile App
2. Login via:
   - Email + Password (Owner, Admin, HR, GM, Vendor)
   - Biometric / Face Device Sync (Staff)
3. System identifies role
4. User redirected to role-specific dashboard
5. RBAC ensures each role sees only allowed modules

### 2. Owner Dashboard Flow

**Features:**
- Live vineyard temperature graph (7 AM – 10 PM)
- CO₂ barrel compliance status
- Attendance summary (biometric + face + QR)
- Inventory & vendor overview
- Purchase order approvals
- AI assistant (TOAI)

**Capabilities:**
- View alerts (temperature breach, missed CO₂ filling)
- Approve/reject purchase requests
- Ask TOAI questions:
  - "Which barrel missed CO₂ refill?"
  - "Today's attendance status"
  - "Any risk today?"
- Export reports (Daily / Weekly / Monthly)

### 3. Admin Dashboard Flow

**Responsibilities:**
- Master data management
- Device & camera mapping
- User & role creation

**Features:**
- Create / manage users (HR, GM, Staff, Cleaner, Caretaker, Gas Filler)
- Register IoT devices:
  - Temperature sensors
  - CO₂ barrels (each with unique QR)
  - Cameras
  - Biometric & face machines
- Define thresholds:
  - Temperature limits
  - CO₂ refill frequency
- System configuration

### 4. HR Dashboard Flow

**Attendance Sources:**
- Biometric machine
- Face recognition device
- Mobile QR (fallback)

**Flow:**
1. Staff arrives at vineyard
2. Attendance captured via:
   - Biometric scan OR
   - Face recognition OR
   - QR code (mobile)
3. Device syncs data to ERP
4. HR dashboard shows:
   - Present / Absent
   - Late / Early exit
   - Attendance method used
5. HR generates:
   - Attendance reports
   - Salary inputs
6. Owner also sees HR summaries (read-only)

### 5. GM Dashboard Flow

**Focus Areas:**
- Temperature monitoring
- CO₂ refill compliance
- Inventory management
- Staff task status

**Features:**
- Live temperature tiles
- CO₂ barrel due list
- Low stock alerts
- Task assignment:
  - CO₂ refill tasks to CO₂ Manager
  - Cleaning tasks to Cleaners
- Alerts for:
  - Temperature threshold breaches
  - Barrel refill overdue

### 6. Temperature Monitoring Flow (IoT)

**Device Options:**
- **Option 1 (Industry Standard)**: Davis Vantage Pro2
  - Professional weather station
  - WeatherLink API integration
- **Option 2 (Mid-range)**: Netatmo Pro Weather Station
  - Wireless, compact device
  - REST JSON API
- **Option 3 (Recommended - Custom IoT)**: ESP32 / Raspberry Pi
  - Sensors: DS18B20 / DHT22
  - Optional: CO₂, soil moisture, humidity
  - Full control for ERP + AI (TOAI)

**Flow:**
1. Sensor records temperature (minimum 7 times/day)
2. Data sent to ERP backend (via API / gateway)
3. Stored with timestamp & location
4. Dashboards update in real time
5. If threshold crossed:
   - Alert sent to GM & Owner
   - TOAI highlights issue

### 7. CO₂ Barrel Refill Flow (QR-Based + Sensor Optional)

**Actors:**
- CO₂ Manager (Gas Filler)

**Devices (Optional Enhancement):**
- MH-Z19 CO₂ Sensor (NDIR Technology)
  - Range: 0–5000 ppm
  - Accuracy: ±50 ppm + 5%
  - Resistant to alcohol vapors
  - Mounted near barrel bung (10–30 cm)

**Flow:**
1. System auto-calculates CO₂ refill due date
2. CO₂ Manager receives task on mobile
3. At barrel location:
   - Worker scans QR code on barrel
   - App opens barrel details
   - Worker fills CO₂
   - Optional: CO₂ sensor validates concentration (ppm)
4. Worker updates:
   - Quantity
   - Time
   - Status marked as Completed
5. ERP updates:
   - Last filled date
   - Next due date
   - Sensor reading (if available)
6. GM & Owner dashboards update
7. Each barrel maintains full refill + sensor history (audit & compliance ready)

### 8. Cleaning Staff Monitoring Flow (Camera + Attendance)

**Devices:**
- CCTV cameras
- Attendance machines (biometric/face)

**Flow:**
1. Cleaner marks attendance (biometric / face)
2. Camera monitors assigned zones
3. Camera feed linked to:
   - Time window
   - Staff ID
4. GM/Admin can:
   - View live / recorded feed
   - Cross-check attendance vs activity
5. Ensures accountability & quality control

### 9. Inventory Management Flow

**Flow:**
1. Inventory auto-updated from:
   - CO₂ usage
   - Cleaning material usage
2. Stock level decreases
3. If stock below threshold:
   - Alert to GM
   - GM raises purchase request
   - Owner approves
   - Vendor processes order
4. Inventory updated on delivery

### 10. Vendor Portal Flow

**Vendor Access:**
- Limited role-based login

**Flow:**
1. Owner/HR/Admin/GM creates a post (requirement/request)
2. **Email notification sent to all vendors** - "Email is sent to vendors"
3. Vendor logs in
4. Views:
   - Purchase orders
   - Delivery status
   - Available posts/requirements
5. Vendor applies to a post with offer and quote
6. **Email notification sent to owner** - "Email is sent to owner"
7. Updates:
   - Dispatch status
   - Invoice upload
8. ERP updates inventory on delivery
9. Vendor performance logged

### 11. TOAI (AI Assistant) Flow

**Capabilities:**
- Reads ERP data only (no manual entry)
- Real-time data analysis

**Flow:**
1. Owner / HR / GM asks question
2. TOAI fetches real-time ERP data
3. Returns:
   - Summary
   - Alerts
   - Insights

**Example Queries:**
- "Today's temperature violations"
- "Which staff missed attendance"
- "Inventory to reorder this week"
- "Which barrels need CO₂?"
- "Any risk today?"

### 12. Overall Data Flow Summary

```
IoT Devices / Cameras / Biometric 
  → Central ERP Backend 
  → Role-Based Dashboards 
  → Reports & AI Insights (TOAI)
```

## 📁 Project Structure

```
sukri_vineyard_s/
├── app/                          # Next.js app directory
│   ├── dashboard/                # Role-based dashboards
│   │   ├── owner/               # Owner dashboard
│   │   ├── admin/               # Admin dashboard
│   │   ├── hr/                  # HR dashboard
│   │   ├── gm/                  # GM dashboard
│   │   ├── vendor/              # Vendor dashboard
│   │   └── staff/               # Staff dashboard
│   ├── attendance/              # Attendance page
│   ├── co2/                     # CO₂ management page
│   ├── temperature/             # Temperature & weather page
│   ├── inventory/                # Inventory page
│   ├── vendors/                 # Vendors & procurement page
│   ├── reports/                 # Reports page
│   ├── ai-assistant/            # AI assistant page
│   ├── profile/                 # User profile page
│   ├── settings/                # Settings page
│   ├── login/                   # Login page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx          # Sidebar navigation
│   │   ├── header.tsx           # Top header
│   │   └── main-layout.tsx     # Main layout wrapper
│   ├── cards/                   # Card components
│   ├── charts/                  # Chart components
│   ├── ai-assistant/            # AI assistant components
│   └── ui/                      # ShadCN UI components
├── store/                        # Zustand stores
│   ├── authStore.ts             # Authentication store
│   └── dashboardStore.ts        # Dashboard state
├── utils/                        # Utility functions
│   ├── constants.ts             # Constants and sidebar items
│   ├── permissions.ts            # RBAC permissions
│   └── cn.ts                     # Class name utility
├── backend/                      # NestJS backend
│   └── src/
│       ├── modules/             # Feature modules
│       │   ├── auth/            # Authentication
│       │   ├── users/           # User management
│       │   ├── attendance/      # Attendance
│       │   ├── co2/             # CO₂ management
│       │   ├── inventory/       # Inventory
│       │   ├── vendors/         # Vendors
│       │   └── temperature/    # Temperature
│       └── main.ts              # Application entry
└── README.md                     # This file
```

## 🚀 Getting Started

For complete setup instructions, see **[SETUP.md](SETUP.md)**

### Quick Start

1. **Setup Database** - Import `database/sukri_vineyard.sql`
2. **Setup Backend** - Configure `backend/.env` and run `npm run start:dev`
3. **Setup Frontend** - Configure `.env.local` and run `npm run dev`
4. **Login** - Use demo credentials (see [SETUP.md](SETUP.md))

For detailed steps, database setup, and troubleshooting, please refer to **[SETUP.md](SETUP.md)**

## 🔑 Demo Credentials

See **[SETUP.md](SETUP.md)** for complete demo credentials list.

## 📱 Features by Role

### Owner Dashboard
- ✅ Aggregated KPI cards
- ✅ Live temperature graph (7 AM - 10 PM)
- ✅ CO₂ barrel compliance table
- ✅ Attendance summary
- ✅ Low stock alerts
- ✅ Purchase order approvals
- ✅ Vendor overview
- ✅ TOAI AI assistant

### Admin Dashboard
- ✅ User management (create HR, GM, Staff, Cleaner, Caretaker, Gas Filler)
- ✅ Device registration (IoT, cameras, biometric)
- ✅ System configuration
- ✅ Camera mapping
- ✅ Threshold settings

### HR Dashboard
- ✅ Attendance by method (biometric/face/QR)
- ✅ Staff list and profiles
- ✅ Attendance reports
- ✅ Leave management
- ✅ Salary inputs

### GM Dashboard
- ✅ Temperature monitoring
- ✅ CO₂ compliance tracking
- ✅ Task assignment
- ✅ Inventory alerts
- ✅ Staff task status
- ✅ View user management (read-only, cannot create users)

### Staff Dashboard
- ✅ Assigned tasks
- ✅ CO₂ fill checklist (for Gas Filler)
- ✅ Temperature logs (for Caretaker)
- ✅ Attendance history

### Vendor Portal
- ✅ Purchase orders view
- ✅ Delivery status updates
- ✅ Invoice upload
- ✅ Dispatch management

## 🎨 UI/UX Features

- **Dark & Light Mode** - Full theme support
- **Responsive Design** - Desktop first, mobile adaptive
- **Professional UI** - Clean, premium, data-dense but readable
- **Smooth Animations** - Hover effects and transitions
- **Role-Based Navigation** - Sidebar filtered by user role
- **Real-Time Updates** - Live data from IoT devices
- **Interactive Charts** - Tooltips and legends

## 🔧 Development

### Adding New Features

1. **Frontend Component**
   - Create component in `components/`
   - Add to appropriate page in `app/`

2. **Backend API**
   - Create module in `backend/src/modules/`
   - Add controller, service, and entity
   - Add data to database using SQL scripts

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting (recommended)

## 📊 Data Flow Architecture

```
┌─────────────────┐
│  IoT Devices    │
│  (Sensors)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ERP Backend    │
│  (NestJS API)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Role-Based     │
│  Dashboards     │
└─────────────────┘
```

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Role-based authentication
- ✅ Basic dashboards
- ✅ Mock data integration
- ✅ UI/UX implementation

### Phase 2 (Planned)
- [ ] Real IoT device integration
- [ ] Biometric device sync
- [ ] Camera live feed integration
- [ ] QR code scanning (mobile)
- [ ] Real-time WebSocket updates

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Machine learning predictions
- [ ] Automated reporting
- [ ] Multi-vineyard support

## 📝 License

This project is proprietary software for Sukhri Vineyard operations.

## 👥 Support

For issues, questions, or feature requests, please contact the development team.

---

**Built with ❤️ for Sukhri Vineyard**
