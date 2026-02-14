# PostgreSQL Database Setup Guide

## Quick Setup Steps

Follow these steps to set up the PostgreSQL database for Scaffoldz:

### Step 1: Create the Database

1. Open **pgAdmin** (the PostgreSQL administration tool)
2. In the left sidebar, expand **Servers** → **PostgreSQL**
3. Right-click on **Databases** and select **Create** → **Database**
4. In the dialog:
   - **Database name**: `scaffoldz`
   - **Owner**: `postgres` (or `pgadmin` - must match `DB_USER` in your `.env` file)
   - Click **Save**

**OR** use the SQL query tool:
- Right-click on **PostgreSQL** → **Query Tool**
- Copy and paste the contents of `server/database/create_database.sql`
- Click **Execute** (F5)

### Step 2: Create the Tables

1. In pgAdmin, find your new **scaffoldz** database in the left sidebar
2. Right-click on **scaffoldz** → **Query Tool**
3. Open the file `server/database/schema.sql` in a text editor
4. Copy ALL the contents
5. Paste into the pgAdmin Query Tool
6. Click **Execute** (F5) or press F5

You should see messages like:
```
CREATE TABLE
CREATE INDEX
CREATE FUNCTION
CREATE TRIGGER
...
```

### Step 3: Verify Tables Were Created

1. In pgAdmin, expand: **scaffoldz** → **Schemas** → **public** → **Tables**
2. You should see 5 tables:
   - `users`
   - `otp_store`
   - `projects`
   - `issues`
   - `feedback`

### Step 4: Restart the Server

The backend server will now automatically connect to PostgreSQL!

```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ All database tables already exist
✅ Server running on http://localhost:3000
💾 Database: PostgreSQL
   Database name: scaffoldz
   Host: localhost:5432
```

---

## Database Schema Overview

### Tables Created

#### 1. **users**
Stores all user accounts (customers, management, contractors)
- `id` - Auto-incrementing primary key
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `role` - customer/management/contractor
- `verified` - Email verification status
- `created_at`, `updated_at` - Timestamps

#### 2. **otp_store**
Temporary storage for OTP codes
- `id` - Auto-incrementing primary key
- `email` - User's email
- `otp` - 6-digit code
- `purpose` - signup/login/etc
- `expires_at` - Expiration timestamp
- Automatically cleaned up every 5 minutes

#### 3. **projects**
All construction projects
- `id` - Project ID (PROJECT-00001, etc.)
- `title`, `address`, `project_type`, `timeline`
- `budget` - Decimal value
- `customer_email` - Foreign key to users
- `status` - Submitted/Under Review/Under Construction/Completed
- `progress` - 0-100 percentage
- `blueprint_path` - File path
- `expected_completion` - Timestamp
- `created_at`, `updated_at` - Timestamps

#### 4. **issues**
Project issues raised by customers
- `id` - Issue ID (ISSUE-00001, etc.)
- `project_id` - Foreign key to projects
- `subject`, `description`
- `priority` - Low/Medium/High/Critical
- `status` - Open/In Progress/Resolved/Closed
- `created_at`, `updated_at` - Timestamps

#### 5. **feedback**
Customer feedback for completed projects
- `id` - Auto-incrementing primary key
- `project_id` - Foreign key to projects (unique)
- `rating` - 1-5 stars
- `comment` - Optional text
- `submitted_at` - Timestamp

---

## Troubleshooting

### "Database does not exist" Error

**Solution**: Run Step 1 above to create the database

### "relation does not exist" Error

**Solution**: Run Step 2 above to create the tables

### "password authentication failed" Error

**Solution**: Check your PostgreSQL password and update `.env`:
```
DB_USER=postgres  # or pgadmin
DB_PASSWORD=your_actual_password
```

### "the database system is starting up"

**Solution**: Wait a few seconds for PostgreSQL to fully start, then try again

### Permission Errors

**Solution**: Make sure your database user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE scaffoldz TO postgres;  -- or pgadmin
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

---

## Connection Details

The server uses these environment variables (from `.env`):

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scaffoldz
DB_USER=postgres  # or pgadmin - must match database owner
DB_PASSWORD=your_password_here
```

---

## Data Persistence

✅ **All data is now persistent!**

- User accounts survive server restarts
- Projects are permanently stored
- Issues and feedback are preserved
- No more data loss when stopping the server

---

## Next Steps

1. Complete the setup steps above
2. Start your backend server
3. Test creating a user account
4. Test creating a project
5. Verify data persists after server restart

---

##Security Notes

⚠️ **Important**: 
- Your database password is stored in `.env` 
- Add `.env` to `.gitignore` (already done)
- Never commit `.env` to version control
- Use strong passwords in production
- Consider using environment-specific `.env` files

---

## Migration Complete! 🎉

Your Scaffoldz application now uses PostgreSQL for all data storage. All features work exactly the same, but data is now persistent and ready for production deployment!
