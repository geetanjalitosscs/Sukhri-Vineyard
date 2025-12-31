# API Documentation - Sukhri Vineyard

## 📋 Table of Contents
1. [API Configuration](#api-configuration)
2. [All API Endpoints](#all-api-endpoints)
3. [cURL Commands](#curl-commands)
4. [Using API Services](#using-api-services)
5. [Authentication](#authentication)

---

## API Configuration

### 🔧 Where to Change API URL

The API URL is **centralized** in one location for easy configuration.

#### Option 1: Environment Variable (Recommended)

Create or update `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

#### Option 2: Direct Configuration

Edit `api/config/api.config.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

**Change the default value:**
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com/api';
```

**That's it!** All API calls will automatically use the new URL.

---

## All API Endpoints

### Base URL
- **Development:** `http://localhost:3001/api`
- **Production:** Set via `NEXT_PUBLIC_API_URL` or `api/config/api.config.ts`

---

### 🔐 Authentication Endpoints

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** User authentication
- **Request Body:**
  ```json
  {
    "email": "owner@sukrivineyard.com",
    "password": "Admin@123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt-token-here",
    "user": {
      "id": "uuid",
      "email": "owner@sukrivineyard.com",
      "name": "Vineyard Owner",
      "role": "owner"
    }
  }
  ```

#### Get Profile
- **Endpoint:** `POST /api/auth/profile`
- **Description:** Get current user profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object

---

### 👥 Users Endpoints

#### Get All Users
- **Endpoint:** `GET /api/users`
- **Description:** Get all users (Owner/Admin/HR only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of user objects

#### Get User Profile
- **Endpoint:** `GET /api/users/profile`
- **Description:** Get current user profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object

#### Create User
- **Endpoint:** `POST /api/users`
- **Description:** Create new user (Owner/Admin/HR only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "email": "newuser@sukrivineyard.com",
    "password": "Password123",
    "name": "New User",
    "role": "staff",
    "vineyardId": "sukhri",
    "phone": "+91 98765 43210",
    "createdBy": "user-id-here"
  }
  ```
- **Response:** Created user object

---

### 👤 Attendance Endpoints

#### Get Today's Attendance
- **Endpoint:** `GET /api/attendance/today`
- **Description:** Get today's attendance summary
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "present": 5,
    "absent": 2,
    "late": 1,
    "onLeave": 0,
    "total": 8,
    "biometric": 3,
    "faceRecognition": 2,
    "qrCode": 0
  }
  ```

#### Get Weekly Stats
- **Endpoint:** `GET /api/attendance/weekly`
- **Description:** Get weekly attendance statistics
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Object with day-wise stats

#### Get Attendance Records
- **Endpoint:** `GET /api/attendance/records`
- **Description:** Get all attendance records
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of attendance record objects

---

### 📦 Inventory Endpoints

#### Get All Inventory
- **Endpoint:** `GET /api/inventory`
- **Description:** Get all inventory items
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "items": [...],
    "lowStockCount": 3,
    "totalItems": 25,
    "totalValue": 150000
  }
  ```

#### Get Low Stock Items
- **Endpoint:** `GET /api/inventory/low-stock`
- **Description:** Get items below minimum threshold
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of low stock items

---

### 💨 CO₂ Management Endpoints

#### Get All Barrels
- **Endpoint:** `GET /api/co2/barrels`
- **Description:** Get all CO₂ barrels
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of barrel objects

#### Get Overdue Barrels
- **Endpoint:** `GET /api/co2/overdue`
- **Description:** Get barrels that need refilling
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "count": 2,
    "barrels": [...]
  }
  ```

---

### 🌡️ Temperature Endpoints

#### Get Temperature Readings
- **Endpoint:** `GET /api/temperature/readings`
- **Description:** Get temperature and humidity readings
- **Query Params:** `?deviceId=TEMP-001` (optional)
- **Response:** Array of reading objects
  ```json
  [
    {
      "time": "09:00",
      "temperature": 22.5,
      "humidity": 70,
      "status": "normal"
    }
  ]
  ```

#### Get Temperature Stats
- **Endpoint:** `GET /api/temperature/stats`
- **Description:** Get temperature statistics
- **Query Params:** `?deviceId=TEMP-001` (optional)
- **Response:**
  ```json
  {
    "average": 24.5,
    "max": 30.1,
    "min": 18.2,
    "alerts": 2
  }
  ```

---

### 🚚 Vendors Endpoints

#### Get All Vendors
- **Endpoint:** `GET /api/vendors`
- **Description:** Get all vendors
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of vendor objects

#### Get Purchase Orders
- **Endpoint:** `GET /api/vendors/purchase-orders`
- **Description:** Get all purchase orders
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "purchaseOrders": [...],
    "activeVendors": 5,
    "openPOs": 3,
    "closedPOs": 12,
    "pendingApprovals": 2
  }
  ```

---

### 📋 Tasks Endpoints

#### Get All Tasks
- **Endpoint:** `GET /api/tasks`
- **Description:** Get all tasks (Owner/GM/Admin/HR only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of task objects

#### Get User Tasks
- **Endpoint:** `GET /api/tasks/user/:userId`
- **Description:** Get tasks assigned to specific user
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of task objects

#### Create Task
- **Endpoint:** `POST /api/tasks`
- **Description:** Create new task (Owner/GM/Admin/HR only)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Refill CO₂ Barrel",
    "type": "co2-refill",
    "assignedToUserId": "user-id",
    "assignedToName": "John Doe",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-01-15",
    "barrelId": "BARREL-001",
    "zone": "Block A",
    "description": "Refill CO₂ barrel in Block A"
  }
  ```
- **Response:** Created task object

---

### 📢 Posts Endpoints

#### Get All Posts
- **Endpoint:** `GET /api/posts`
- **Description:** Get all requirement posts
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of post objects

#### Get Open Posts
- **Endpoint:** `GET /api/posts/open`
- **Description:** Get open requirement posts
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of open post objects

---

### 📱 Devices Endpoints

#### Get All Devices
- **Endpoint:** `GET /api/devices`
- **Description:** Get all devices (Owner/GM/Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of device objects

#### Get Cameras
- **Endpoint:** `GET /api/devices/cameras`
- **Description:** Get all camera devices
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of camera objects

---

### 🤖 AI Assistant Endpoints

#### Query AI
- **Endpoint:** `POST /api/ai/query`
- **Description:** Query AI assistant (TOAI)
- **Request Body:**
  ```json
  {
    "query": "What is today's attendance status?"
  }
  ```
- **Response:**
  ```json
  {
    "response": "Today's attendance: 5 present, 2 absent..."
  }
  ```

---

## cURL Commands

### Authentication

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@sukrivineyard.com",
    "password": "Admin@123"
  }'
```

#### Get Profile (with token)
```bash
curl -X POST http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Users

#### Get All Users
```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@sukrivineyard.com",
    "password": "Password123",
    "name": "New User",
    "role": "staff"
  }'
```

### Attendance

#### Get Today's Attendance
```bash
curl -X GET http://localhost:3001/api/attendance/today \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Weekly Stats
```bash
curl -X GET http://localhost:3001/api/attendance/weekly \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Records
```bash
curl -X GET http://localhost:3001/api/attendance/records \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Inventory

#### Get All Inventory
```bash
curl -X GET http://localhost:3001/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Low Stock
```bash
curl -X GET http://localhost:3001/api/inventory/low-stock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### CO₂ Management

#### Get All Barrels
```bash
curl -X GET http://localhost:3001/api/co2/barrels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Overdue Barrels
```bash
curl -X GET http://localhost:3001/api/co2/overdue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Temperature

#### Get Readings
```bash
curl -X GET http://localhost:3001/api/temperature/readings
```

#### Get Readings for Specific Device
```bash
curl -X GET "http://localhost:3001/api/temperature/readings?deviceId=TEMP-001"
```

#### Get Stats
```bash
curl -X GET http://localhost:3001/api/temperature/stats
```

### Vendors

#### Get All Vendors
```bash
curl -X GET http://localhost:3001/api/vendors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Purchase Orders
```bash
curl -X GET http://localhost:3001/api/vendors/purchase-orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tasks

#### Get All Tasks
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get User Tasks
```bash
curl -X GET http://localhost:3001/api/tasks/user/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Refill CO₂ Barrel",
    "type": "co2-refill",
    "assignedToUserId": "user-id",
    "assignedToName": "John Doe",
    "status": "pending",
    "priority": "high"
  }'
```

### Posts

#### Get All Posts
```bash
curl -X GET http://localhost:3001/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Open Posts
```bash
curl -X GET http://localhost:3001/api/posts/open \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Devices

#### Get All Devices
```bash
curl -X GET http://localhost:3001/api/devices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Cameras
```bash
curl -X GET http://localhost:3001/api/devices/cameras \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### AI Assistant

#### Query AI
```bash
curl -X POST http://localhost:3001/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is today'\''s attendance status?"
  }'
```

---

## Using API Services

### Import Services

```typescript
import { 
  authService,
  attendanceService,
  co2Service,
  inventoryService,
  temperatureService,
  vendorsService,
  usersService,
  tasksService,
  postsService,
  devicesService,
  aiService
} from '@/api';
```

### Example Usage

```typescript
// Login
const response = await authService.login('owner@sukrivineyard.com', 'Admin@123');
const token = response.access_token;

// Get attendance
const today = await attendanceService.getToday();

// Get inventory
const inventory = await inventoryService.getAll();

// Get temperature readings
const readings = await temperatureService.getReadings();

// Query AI
const aiResponse = await aiService.query("What is today's attendance?");
```

---

## Authentication

### How Authentication Works

1. **Login** to get JWT token:
   ```typescript
   const response = await authService.login(email, password);
   const token = response.access_token;
   ```

2. **Token is automatically added** to all API requests via interceptors in `api/config/api.config.ts`

3. **Token is stored** in Zustand store (`store/authStore.ts`)

4. **Auto logout** on 401 errors (token expired or invalid)

### Manual Token Usage

If you need to manually add token:

```bash
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Features

- ✅ **Centralized Configuration** - Change URL in one place
- ✅ **Automatic Auth Token** - Tokens added automatically
- ✅ **Error Handling** - Global error interceptors
- ✅ **TypeScript Types** - Full type safety
- ✅ **Auto Logout** - Redirects to login on 401 errors
- ✅ **Timeout Protection** - 30 second request timeout

---

## Support

For setup instructions, see [SETUP.md](../SETUP.md)

For feature details, see [FEATURES.md](../FEATURES.md)
