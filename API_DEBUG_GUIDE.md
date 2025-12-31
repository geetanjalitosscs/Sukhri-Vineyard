# 🔍 API Debugging Guide

## ✅ Changes Applied

I've added comprehensive logging to all API services and controllers to help diagnose why data isn't showing:

### Services Updated:
- ✅ `TemperatureService` - Added logging for readings and stats
- ✅ `Co2Service` - Added logging for barrels and overdue
- ✅ `InventoryService` - Added logging for items
- ✅ `AttendanceService` - Added logging for attendance data

### Controllers Updated:
- ✅ `TemperatureController` - Added error handling and logging
- ✅ `Co2Controller` - Added error handling and logging
- ✅ `InventoryController` - Added error handling and logging
- ✅ `AttendanceController` - Added error handling and logging

---

## 🔍 How to Debug

### Step 1: Check Backend Console

When you make API calls, you should now see logs like:

```
[TemperatureService] Found 0 temperature readings
[TemperatureController] Returning 0 readings
[InventoryService] Found 5 inventory items
[InventoryController] Returning 5 items
```

### Step 2: Check for Errors

If there are database errors, you'll see:

```
[TemperatureService] Error fetching readings: [error details]
[InventoryService] Error in findAll: [error details]
```

### Step 3: Common Issues

#### Issue 1: Empty Database
**Symptom:** Logs show "Found 0" for everything
**Solution:** Import database data from `database/sukri_vineyard.sql`

#### Issue 2: Database Connection Error
**Symptom:** Error logs show connection failures
**Solution:** 
- Check PostgreSQL is running
- Verify `.env` file has correct database credentials
- Check database `sukri_vineyard` exists

#### Issue 3: Table Not Found
**Symptom:** Error logs show "relation does not exist"
**Solution:** Run database migrations or import SQL file

#### Issue 4: Entity Relationship Issues
**Symptom:** Data exists but queries return empty
**Solution:** Check entity relationships in TypeORM entities

---

## 🧪 Testing APIs

### Test Temperature API:
```bash
curl http://localhost:3001/api/temperature/readings
curl http://localhost:3001/api/temperature/stats
```

### Test Inventory API:
```bash
curl http://localhost:3001/api/inventory
```

### Test Attendance API:
```bash
curl http://localhost:3001/api/attendance/today
curl http://localhost:3001/api/attendance/records
```

### Test CO2 API:
```bash
curl http://localhost:3001/api/co2/barrels
curl http://localhost:3001/api/co2/overdue
```

---

## 📊 What to Look For

1. **Backend Console Logs:**
   - `[ServiceName] Found X items` - Shows how many records were found
   - `[ControllerName] Returning X items` - Confirms data is being sent
   - Error messages - Shows what went wrong

2. **Browser Console (F12):**
   - Network tab - Check if API calls are successful (200 status)
   - Response data - See what data is actually returned
   - Error messages - See frontend errors

3. **Database:**
   - Connect to PostgreSQL and check:
     ```sql
     SELECT COUNT(*) FROM temperature_readings;
     SELECT COUNT(*) FROM inventory_items;
     SELECT COUNT(*) FROM attendance_records;
     SELECT COUNT(*) FROM co2_barrels;
     ```

---

## 🚀 Next Steps

1. **Start backend** and watch console logs
2. **Make API calls** from frontend or curl
3. **Check logs** to see:
   - How many records were found
   - If there are any errors
   - What data is being returned

4. **If data is empty:**
   - Import `database/sukri_vineyard.sql`
   - Or check if database has data in tables

5. **If errors occur:**
   - Check error messages in logs
   - Verify database connection
   - Check entity relationships

---

## 💡 Quick Fixes

### If all APIs return empty arrays:
```sql
-- Check if tables have data
SELECT 'temperature_readings' as table_name, COUNT(*) FROM temperature_readings
UNION ALL
SELECT 'inventory_items', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'attendance_records', COUNT(*) FROM attendance_records
UNION ALL
SELECT 'co2_barrels', COUNT(*) FROM co2_barrels;
```

### If database connection fails:
- Check `backend/.env` file exists
- Verify PostgreSQL is running: `pg_isready`
- Test connection: `psql -U postgres -d sukri_vineyard`

---

The logging will now show you exactly what's happening with each API call!


