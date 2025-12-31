# Sukhri Vineyard - Complete Project Structure

## 📁 Root Directory Structure

```
sukri_vineyard_s/
├── app/                          # Next.js App Router (Frontend Pages)
├── api/                          # Frontend API Services Layer
├── backend/                      # NestJS Backend (REST API)
├── components/                   # React Components
├── database/                     # Database SQL Files
├── store/                        # Zustand State Management
├── utils/                        # Utility Functions
├── hooks/                        # Custom React Hooks
├── public/                       # Static Assets
├── services/                     # Legacy API Services (unused)
├── .env.local                    # Frontend Environment Variables
├── next.config.js                # Next.js Configuration
├── package.json                  # Frontend Dependencies
├── tailwind.config.ts            # Tailwind CSS Configuration
├── tsconfig.json                 # TypeScript Configuration
├── README.md                     # Main Project Documentation
├── SETUP.md                      # Complete Setup Guide
├── FEATURES.md                   # Features Documentation
└── PROJECT_STRUCTURE.md          # This File
```

---

## 📁 Frontend Structure (`app/`)

```
app/
├── ai-assistant/
│   └── page.tsx                  # AI Assistant Page
├── attendance/
│   └── page.tsx                  # Staff Attendance Management
├── cameras/
│   └── page.tsx                  # Camera Monitoring
├── co2/
│   └── page.tsx                  # CO₂ Barrel Management
├── dashboard/
│   ├── admin/
│   │   └── page.tsx              # Admin Dashboard
│   ├── gm/
│   │   └── page.tsx              # General Manager Dashboard
│   ├── hr/
│   │   └── page.tsx              # HR Manager Dashboard
│   ├── owner/
│   │   └── page.tsx              # Owner Dashboard
│   ├── staff/
│   │   └── page.tsx              # Staff Dashboard
│   └── vendor/
│       └── page.tsx              # Vendor Dashboard
├── hardware/
│   └── page.tsx                  # Hardware Requirements
├── inventory/
│   └── page.tsx                  # Inventory Management
├── login/
│   └── page.tsx                  # Login Page
├── my-applications/
│   └── page.tsx                  # Vendor Applications
├── my-attendance/
│   └── page.tsx                  # My Attendance (Staff View)
├── offers/
│   └── (empty)
├── profile/
│   └── page.tsx                  # User Profile
├── reports/
│   └── page.tsx                  # Reports Page
├── settings/
│   └── page.tsx                  # Settings Page
├── tasks/
│   └── page.tsx                  # Task Management
├── temperature/
│   └── page.tsx                  # Temperature Monitoring
├── users/
│   └── page.tsx                  # User Management
├── vendors/
│   └── page.tsx                  # Vendors & Procurement
├── vineyards/
│   └── (empty)
├── globals.css                   # Global Styles
├── layout.tsx                    # Root Layout
├── loading.tsx                   # Loading Component
└── page.tsx                      # Home Page (Redirects)
```

---

## 📁 API Services Structure (`api/`)

```
api/
├── config/
│   └── api.config.ts             # API Configuration (Centralized URL)
├── services/
│   ├── ai.service.ts             # AI Assistant API
│   ├── attendance.service.ts     # Attendance API
│   ├── auth.service.ts           # Authentication API
│   ├── co2.service.ts            # CO₂ Management API
│   ├── devices.service.ts        # Devices API
│   ├── inventory.service.ts      # Inventory API
│   ├── posts.service.ts          # Posts API
│   ├── tasks.service.ts          # Tasks API
│   ├── temperature.service.ts    # Temperature API
│   ├── users.service.ts          # Users API
│   └── vendors.service.ts        # Vendors API
├── index.ts                       # Centralized Exports
└── README.md                     # API Documentation
```

---

## 📁 Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── modules/                  # Feature Modules (MVC Pattern)
│   │   ├── ai/
│   │   │   ├── ai.controller.ts  # AI Controller
│   │   │   ├── ai.module.ts      # AI Module
│   │   │   └── ai.service.ts     # AI Service
│   │   ├── attendance/
│   │   │   ├── entities/
│   │   │   │   └── attendance-record.entity.ts
│   │   │   ├── attendance.controller.ts
│   │   │   ├── attendance.module.ts
│   │   │   └── attendance.service.ts
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── local-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── co2/
│   │   │   ├── entities/
│   │   │   │   ├── co2-barrel.entity.ts
│   │   │   │   └── co2-refill-history.entity.ts
│   │   │   ├── co2.controller.ts
│   │   │   ├── co2.module.ts
│   │   │   └── co2.service.ts
│   │   ├── devices/
│   │   │   ├── entities/
│   │   │   │   └── device.entity.ts
│   │   │   ├── devices.controller.ts
│   │   │   ├── devices.module.ts
│   │   │   └── devices.service.ts
│   │   ├── inventory/
│   │   │   ├── entities/
│   │   │   │   └── inventory-item.entity.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.module.ts
│   │   │   └── inventory.service.ts
│   │   ├── posts/
│   │   │   ├── entities/
│   │   │   │   ├── post.entity.ts
│   │   │   │   └── post-requirement.entity.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.module.ts
│   │   │   └── posts.service.ts
│   │   ├── tasks/
│   │   │   ├── entities/
│   │   │   │   └── task.entity.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.module.ts
│   │   │   └── tasks.service.ts
│   │   ├── temperature/
│   │   │   ├── entities/
│   │   │   │   └── temperature-reading.entity.ts
│   │   │   ├── temperature.controller.ts
│   │   │   ├── temperature.module.ts
│   │   │   └── temperature.service.ts
│   │   ├── users/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── seed.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── vendors/
│   │   │   ├── entities/
│   │   │   │   ├── purchase-order.entity.ts
│   │   │   │   ├── purchase-order-item.entity.ts
│   │   │   │   └── vendor.entity.ts
│   │   │   ├── vendors.controller.ts
│   │   │   ├── vendors.module.ts
│   │   │   └── vendors.service.ts
│   │   └── vineyards/
│   │       ├── entities/
│   │       │   └── vineyard.entity.ts
│   │       └── vineyards.module.ts
│   ├── app.controller.ts         # Root Controller
│   ├── app.module.ts              # Root Module
│   ├── app.service.ts             # Root Service
│   └── main.ts                    # Application Entry Point
├── dist/                          # Compiled JavaScript (Generated)
├── node_modules/                  # Backend Dependencies
├── .env                           # Backend Environment Variables
├── nest-cli.json                  # NestJS CLI Configuration
├── package.json                   # Backend Dependencies
├── start-server.bat               # Windows Start Script
└── tsconfig.json                  # TypeScript Configuration
```

---

## 📁 Components Structure (`components/`)

```
components/
├── ai-assistant/
│   └── toai-widget.tsx            # TOAI AI Assistant Widget
├── cards/
│   └── kpi-card.tsx               # KPI Card Component
├── charts/
│   ├── attendance-chart.tsx       # Attendance Pie Chart
│   └── temperature-chart.tsx      # Temperature Line Chart
├── icons/
│   └── (empty)
├── layout/
│   ├── header.tsx                 # Top Header Component
│   ├── main-layout.tsx            # Main Layout Wrapper
│   └── sidebar.tsx                 # Sidebar Navigation
├── scroll-preservation-script.tsx # Scroll Position Script
├── theme-provider.tsx              # Theme Provider (Dark/Light)
└── ui/                            # ShadCN UI Components
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── loading-spinner.tsx
    ├── select.tsx
    ├── tabs.tsx
    ├── toast.tsx
    ├── toaster.tsx
    └── use-toast.ts
```

---

## 📁 Database Structure (`database/`)

```
database/
├── migrations/
│   └── (empty - migrations can be added here)
├── schema.sql                     # Database Schema (Tables Only)
├── sukri_vineyard.sql             # Complete Database (Schema + Data)
└── insert_data.sql                # (Removed - data in sukri_vineyard.sql)
```

---

## 📁 Store Structure (`store/`)

```
store/
├── authStore.ts                   # Authentication State (Zustand)
└── dashboardStore.ts              # Dashboard State (Zustand)
```

---

## 📁 Utils Structure (`utils/`)

```
utils/
├── cn.ts                          # Class Name Utility (Tailwind)
├── constants.ts                    # Constants & Sidebar Items
└── permissions.ts                 # RBAC Permission Functions
```

---

## 📁 Hooks Structure (`hooks/`)

```
hooks/
└── useScrollPreservation.ts       # Scroll Position Hook
```

---

## 📁 Public Assets (`public/`)

```
public/
├── logownew.png                   # Logo Image
├── P1.jpg                         # Profile Image 1 (Male)
├── P2.jpg                         # Profile Image 2 (Female)
├── sukri-dark-logo.png            # Sukhri Vineyard Logo
└── Toai_gpt_logo.png              # TOAI AI Logo
```

---

## 📁 Services (Legacy - Unused)

```
services/
├── api-services.ts                # Legacy API Services (Not Used)
└── api.ts                         # Legacy API Config (Not Used)
```

**Note:** These files are legacy and not used. The project uses `api/` folder instead.

---

## 📁 Configuration Files

### Root Level
- `next.config.js` - Next.js configuration
- `package.json` - Frontend dependencies
- `package-lock.json` - Dependency lock file
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `.env.local` - Frontend environment variables

### Backend Level
- `backend/package.json` - Backend dependencies
- `backend/tsconfig.json` - Backend TypeScript config
- `backend/nest-cli.json` - NestJS CLI configuration
- `backend/.env` - Backend environment variables

---

## 📁 Documentation Files

### Root Level
- `README.md` - Main project documentation
- `SETUP.md` - Complete setup guide
- `FEATURES.md` - Features documentation
- `PROJECT_STRUCTURE.md` - This file

### API Level
- `api/README.md` - API documentation with endpoints and cURL commands

---

## 🏗️ Architecture Overview

### Frontend (Next.js 14)
```
app/                    → Pages (Views)
components/             → Reusable UI Components
api/                    → API Service Layer (Controllers/Services)
store/                  → State Management (Models)
utils/                  → Utility Functions
```

### Backend (NestJS)
```
modules/                → Feature Modules (MVC Pattern)
  ├── {module}/
  │   ├── entities/     → Database Models
  │   ├── *.controller.ts → HTTP Controllers
  │   ├── *.service.ts   → Business Logic
  │   └── *.module.ts    → Dependency Injection
```

### Database
```
database/
  └── sukri_vineyard.sql → Complete Database (Schema + Data)
```

---

## 📊 File Count Summary

- **Frontend Pages:** ~20 pages
- **Backend Modules:** 12 modules
- **Components:** ~20 components
- **API Services:** 11 services
- **Database Entities:** 12 entities
- **Total TypeScript Files:** ~100+ files

---

## 🔑 Key Directories

1. **`app/`** - All frontend pages (Next.js App Router)
2. **`api/`** - Frontend API service layer
3. **`backend/src/modules/`** - Backend feature modules (MVC)
4. **`components/`** - Reusable React components
5. **`database/`** - Database SQL files
6. **`store/`** - Zustand state management
7. **`utils/`** - Utility functions and constants

---

## 📝 Notes

- **MVC Pattern:** Backend follows strict MVC with Controllers, Services, and Entities
- **Centralized API:** All API URLs configured in `api/config/api.config.ts`
- **Role-Based:** All access control based on user role from database
- **TypeScript:** Full TypeScript implementation across frontend and backend
- **Database:** PostgreSQL with TypeORM entities

---

**Last Updated:** $(date)
**Project:** Sukhri Vineyard ERP System

