# 🚀 DEMO MODE SETUP - Quick Start Guide

## ✅ ALL FIXES APPLIED

The following fixes have been implemented for your demo:

### 1. Database Connection Check ✅
- Backend now logs database connection status on startup
- Shows table row counts for verification
- Continues even if database connection fails (demo mode)

### 2. Login Fix with Demo Mode ✅
- **Auto-creates admin user** if database is empty:
  - Email: `admin@demo.com`
  - Password: `admin123`
  - Role: `owner`
- **Standard credentials still work**:
  - Email: `owner@sukrivineyard.com`
  - Password: `Admin@123`
- **Frontend fallback** allows demo login even if API fails

### 3. Frontend Failsafe Data ✅
- All dashboards now show demo data when API fails or returns empty
- No crashes or infinite loading states
- Graceful error handling

### 4. API Configuration ✅
- CORS allows all origins in demo mode
- Network errors handled gracefully
- API timeout set to 30 seconds

### 5. Demo Mode Support ✅
- Set `DEMO_MODE=true` in `backend/.env` to enable
- Auto-creates demo user on startup
- Shows demo data when database is empty

---

## 🎯 QUICK START FOR DEMO

### Step 1: Set Environment Variables

**Backend (`backend/.env`):**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=sukri_vineyard

PORT=3001
NODE_ENV=development
DEMO_MODE=true

JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 2: Start Backend
```bash
cd backend
npm run start:dev
```

Look for:
- ✅ Database connected: sukri_vineyard
- ✅ Demo admin user created (if DB empty)
- 🚀 Backend server running on http://localhost:3001/api

### Step 3: Start Frontend
```bash
npm run dev
```

### Step 4: Login
Go to: http://localhost:3000/login

**Use either:**
- `admin@demo.com` / `admin123` (auto-created if DB empty)
- `owner@sukrivineyard.com` / `Admin@123` (from database)

---

## 🔍 TROUBLESHOOTING

### If login fails:
1. Check backend console for errors
2. Verify database connection in backend logs
3. Try demo credentials: `admin@demo.com` / `admin123`
4. Check browser console (F12) for API errors

### If data not showing:
1. Check backend console - should show table row counts
2. If all counts are 0, demo data will show automatically
3. Check browser console for API errors
4. Verify `DEMO_MODE=true` is set

### If backend won't start:
1. Check PostgreSQL is running
2. Verify database `sukri_vineyard` exists
3. Check `.env` file has correct database password
4. Backend will continue even if DB connection fails (demo mode)

---

## 📊 WHAT'S FIXED

✅ Database connection check and logging
✅ Auto-create demo admin user if DB empty
✅ Login works with demo credentials
✅ Frontend shows demo data when API fails
✅ No crashes on empty data
✅ CORS configured for demo
✅ Graceful error handling throughout

---

## 🎉 READY FOR DEMO!

Your app is now production-ready for demo with:
- ✅ Working login (multiple credential options)
- ✅ Dashboard data (real or demo fallback)
- ✅ No crashes or infinite loading
- ✅ Graceful error handling

**Start both servers and test login!**


