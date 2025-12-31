# Sukhri Vineyard - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Demo Credentials](#demo-credentials)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (for cloning the repository)

---

## Database Setup

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation, remember the password you set for the `postgres` user
3. Ensure PostgreSQL service is running

### Step 2: Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE sukri_vineyard;
```

### Step 3: Import Database Schema and Data

**Important:** Use the complete database file that includes both schema and data:

**File to use:** `database/sukri_vineyard.sql`

This file contains:
- ✅ Complete database schema (all tables, constraints, indexes)
- ✅ All demo data (users, attendance, inventory, vendors, etc.)
- ✅ Ready-to-use database with sample data

#### Option 1: Using psql (Command Line)

```bash
# Windows (PowerShell/CMD)
psql -U postgres -d sukri_vineyard -f database\sukri_vineyard.sql

# Linux/Mac
psql -U postgres -d sukri_vineyard -f database/sukri_vineyard.sql
```

#### Option 2: Using pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on `sukri_vineyard` database → **Query Tool**
4. Click **Open File** (or press `Ctrl+O`)
5. Select `database/sukri_vineyard.sql`
6. Click **Execute** (or press `F5`)

#### Option 3: Using psql with password prompt

```bash
psql -U postgres -d sukri_vineyard -f database/sukri_vineyyard.sql
# Enter password when prompted
```

### Step 4: Run Migration (if needed)

If you need to add the `created_by_user_id` column to users table:

```bash
psql -U postgres -d sukri_vineyard -f database/migrations/add_created_by_to_users.sql
```

### Step 5: Verify Database

Connect to the database and verify tables exist:

```sql
\dt
```

You should see tables like: `users`, `attendance_records`, `inventory_items`, `co2_barrels`, etc.

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sukri_vineyard
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

# Application
NODE_ENV=development
PORT=3001

# JWT Secret (Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_postgres_password` with your actual PostgreSQL password.

### Step 4: Start Backend Server

#### Option 1: Using npm script

```bash
npm run start:dev
```

#### Option 2: Using batch file (Windows)

Double-click `start-server.bat` in the `backend/` folder.

### Step 5: Verify Backend is Running

Open browser and visit:
```
http://localhost:3001/api/temperature/readings
```

You should see JSON data, not an error.

**Backend API will be available at:** `http://localhost:3001/api`

---

## Frontend Setup

### Step 1: Navigate to Root Directory

```bash
cd ..  # If you're in backend folder
# or
cd sukri_vineyard_s  # If starting fresh
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**For Production:** Change this to your production API URL:
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
```

**Alternative:** You can also change the API URL in `api/config/api.config.ts` (see [API README](api/README.md) for details).

### Step 4: Start Frontend Server

```bash
npm run dev
```

### Step 5: Verify Frontend is Running

Open browser and visit:
```
http://localhost:3000
```

You should see the login page.

**Frontend will be available at:** `http://localhost:3000`

---

## Running the Application

### Development Mode

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run start:dev
   ```
   Keep this terminal open!

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   Keep this terminal open!

3. **Open Browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

### Production Build

1. **Build Frontend:**
   ```bash
   npm run build
   npm start
   ```

2. **Build Backend:**
   ```bash
   cd backend
   npm run build
   npm run start:prod
   ```

---

## Demo Credentials

### Owner (Super Admin)
- **Email:** `owner@sukrivineyard.com`
- **Password:** `Admin@123`
- **Access:** Full system access

### Administrator
- **Email:** `admin@sukrivineyard.com`
- **Password:** `Admin@123`
- **Access:** User management, device registration

### HR Manager
- **Email:** `hr@sukrivineyard.com`
- **Password:** `Admin@123`
- **Access:** Staff management, attendance

### General Manager
- **Email:** `gm@sukrivineyard.com`
- **Password:** `Admin@123`
- **Access:** Operations, CO₂, inventory

### Vendor
- **Email:** `vendor@sukrivineyard.com`
- **Password:** `Admin@123`
- **Access:** Purchase orders, deliveries

### Staff Roles
- **Cleaner:** `cleaner@sukrivineyard.com` / `Admin@123`
- **Caretaker:** `caretaker@sukrivineyard.com` / `Admin@123`
- **Gas Filler:** `gasfiller@sukrivineyard.com` / `Admin@123`

---

## Troubleshooting

### Database Connection Issues

**Error:** `Connection refused` or `Cannot connect to database`

**Solutions:**
1. Verify PostgreSQL is running:
   - Windows: Check Services → PostgreSQL
   - Linux: `sudo systemctl status postgresql`
   - Mac: Check Activity Monitor

2. Verify database credentials in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sukri_vineyard
   DB_USERNAME=postgres
   DB_PASSWORD=your_actual_password
   ```

3. Test connection manually:
   ```bash
   psql -U postgres -d sukri_vineyard
   ```

### Backend Not Starting

**Error:** `Port 3001 already in use`

**Solutions:**
1. Find and close the process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3001 | xargs kill
   ```

2. Or change port in `backend/.env`:
   ```env
   PORT=3002
   ```
   Then update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3002/api
   ```

### Frontend Not Connecting to Backend

**Error:** `ERR_CONNECTION_REFUSED` or API calls failing

**Solutions:**
1. Verify backend is running: Visit `http://localhost:3001/api/temperature/readings`
2. Check API URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
3. Check `api/config/api.config.ts` if using direct configuration

### Database Tables Missing

**Error:** Tables not found or empty data

**Solutions:**
1. Re-run the database import:
   ```bash
   psql -U postgres -d sukri_vineyard -f database/sukri_vineyyard.sql
   ```

2. Verify tables exist:
   ```sql
   \dt
   SELECT COUNT(*) FROM users;
   ```

### Module Not Found Errors

**Error:** `Cannot find module` or import errors

**Solutions:**
1. Reinstall dependencies:
   ```bash
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Build Errors

**Error:** TypeScript or build errors

**Solutions:**
1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Check Node.js version (should be 18+):
   ```bash
   node --version
   ```

---

## Next Steps

After successful setup:

1. ✅ Login with demo credentials
2. ✅ Explore role-based dashboards
3. ✅ Test API endpoints (see [API README](api/README.md))
4. ✅ Review features (see [FEATURES.md](FEATURES.md))

---

## Important Files Reference

- **Database File:** `database/sukri_vineyyard.sql` (Complete schema + data)
- **Backend Config:** `backend/.env` (Database & JWT settings)
- **Frontend Config:** `.env.local` (API URL)
- **API Config:** `api/config/api.config.ts` (Centralized API URL)

---

## Support

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section above
- Review [API README](api/README.md) for API documentation
- Review [FEATURES.md](FEATURES.md) for feature details

---

**Setup Complete! 🎉**

Now you can start developing and using the Sukhri Vineyard ERP system.
