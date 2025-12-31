# 🚀 QUICK FIX - Database Connection & Login Issues

## ⚡ IMMEDIATE STEPS (2 minutes)

### Step 1: Create Backend .env File

Create `backend/.env` file with this content:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=sukri_vineyard

PORT=3001
NODE_ENV=development

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:** Change `DB_PASSWORD=postgres` to your actual PostgreSQL password!

### Step 2: Create Frontend .env.local File

Create `.env.local` file in the root directory with:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 3: Make Sure Database Has Data

1. Open pgAdmin or psql
2. Connect to PostgreSQL
3. Make sure database `sukri_vineyard` exists
4. Import `database/sukri_vineyard.sql` if database is empty

### Step 4: Start Backend

```bash
cd backend
npm run start:dev
```

Wait for: `🚀 Backend server running on http://localhost:3001/api`

### Step 5: Start Frontend

In a new terminal:

```bash
npm run dev
```

### Step 6: Test Login

Go to: http://localhost:3000/login

Use these credentials:
- Email: `owner@sukrivineyard.com`
- Password: `Admin@123`

---

## 🔍 TROUBLESHOOTING

### If login still fails:

1. **Check backend is running** - Visit http://localhost:3001/api
2. **Check database connection** - Look at backend console for connection errors
3. **Verify database has users** - Run: `SELECT * FROM users;` in psql
4. **Check .env files exist** - Make sure both `.env` files are created correctly

### If data not showing:

1. **Check browser console** (F12) for API errors
2. **Verify database has data** - Check if tables have rows
3. **Check backend logs** - Look for database query errors

---

## ✅ VERIFICATION CHECKLIST

- [ ] `backend/.env` file exists with correct database password
- [ ] `.env.local` file exists in root directory
- [ ] PostgreSQL is running
- [ ] Database `sukri_vineyard` exists and has data
- [ ] Backend server is running on port 3001
- [ ] Frontend is running on port 3000
- [ ] Can access http://localhost:3001/api
- [ ] Login works with owner credentials


