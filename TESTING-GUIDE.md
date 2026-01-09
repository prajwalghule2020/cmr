# 🔍 TROUBLESHOOTING: UserSkills Not Saving to Database

## Root Cause
The data is NOT being inserted because of **Row Level Security (RLS) policies**. 
The RLS policies require the user to be **authenticated in the browser** to insert data.

## ✅ SOLUTION - Proper Testing Steps

### Step 1: Ensure Dev Server is Running
```bash
npm run dev
```
Server should be running at: http://localhost:3000

### Step 2: Login First
1. Go to: **http://localhost:3000/auth**
2. **Sign up** for a new account OR **login** with existing credentials
3. Make sure you see a successful login

### Step 3: Test the Skills Form
1. After logging in, go to: **http://localhost:3000/test-skills**
2. Fill in the skills form:
   - Skill Name: JavaScript
   - Category: Programming
   - Proficiency Level: Advanced
   - Years of Experience: 5
3. Click **"Save Skills"**

### Step 4: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. You should see logs like:
   ```
   🔍 Starting to save skills for user: <uuid>
   📝 Valid skills to save: [...]
   🗑️ Deleting existing skills...
   ✅ Existing skills deleted (if any)
   💾 Inserting skills: [...]
   ✅ Skills saved successfully: [...]
   ```

### Step 5: Verify in Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/zpfoyipheqjrqvfhhowl
2. Click **Table Editor** in the left sidebar
3. Select **userskills** table
4. You should see your inserted records!

---

## 🚨 Common Issues & Solutions

### Issue 1: "Permission denied" Error
**Cause**: User is not logged in or RLS policies are blocking the insert

**Solution**:
1. Make sure you're logged in (check Step 2 above)
2. Verify RLS policies exist by running this in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'userskills';
   ```

### Issue 2: "Table does not exist" Error
**Cause**: The table hasn't been created yet

**Solution**:
1. Go to Supabase SQL Editor
2. Run the entire `supabase-userSkills-setup.sql` script

### Issue 3: Form shows "You must be logged in"
**Cause**: AuthContext is not detecting the authenticated user

**Solution**:
1. Check browser console for auth errors
2. Verify your .env file has correct Supabase credentials
3. Try logging out and logging in again

---

## 🧪 Alternative: Testing Without RLS (Temporary)

If you want to test the form WITHOUT being logged in (NOT RECOMMENDED for production):

### Option A: Disable RLS Temporarily
Run this in Supabase SQL Editor:
```sql
ALTER TABLE public.userskills DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING**: This makes the table accessible to ANYONE. Only use for testing!

**Re-enable it after testing**:
```sql
ALTER TABLE public.userskills ENABLE ROW LEVEL SECURITY;
```

### Option B: Add a Test Policy
Run this in Supabase SQL Editor:
```sql
CREATE POLICY "Allow test inserts"
ON public.userskills
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
```

**Remove it after testing**:
```sql
DROP POLICY "Allow test inserts" ON public.userskills;
```

---

## 📊 Verify Data in Database

### Method 1: Supabase Dashboard
1. Go to Table Editor
2. Select `userskills` table
3. View all records

### Method 2: Run SQL Query
In Supabase SQL Editor:
```sql
SELECT * FROM public.userskills;
```

### Method 3: Use the Diagnostic Script
```bash
node check-supabase.js
```

---

## ✅ Expected Behavior

When everything is working correctly:

1. User logs in → Session created
2. User fills skills form → Form validates data
3. User clicks "Save" → Data sent to Supabase
4. RLS checks authentication → User ID matches
5. Data inserted → Success message shown
6. Form displays saved skills → UI updates

---

## 🔐 Security Note

The RLS policies are **CORRECT and NECESSARY** for security. They ensure:
- Users can only see their own skills
- Users can only insert/update/delete their own skills
- No user can access another user's data

**DO NOT disable RLS in production!**
