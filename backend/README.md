# Scaffoldz Backend API

Backend server for the Scaffoldz Construction Management Platform built with Node.js, Express, and PostgreSQL.

## Features

- ✅ JWT Authentication with email OTP verification
- ✅ Role-based access control (Customer, Contractor, Management)
- ✅ RESTful API endpoints for all platform features
- ✅ PostgreSQL database with complete relational schema
- ✅ Email service for OTP delivery
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Gmail account for sending OTP emails

## Installation

### 1. Install Dependencies

```powershell
cd backend
npm install
```

### 2. Create PostgreSQL Database

Open PostgreSQL command line tool (psql):

```powershell
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE final;
\c final
\i 'C:/Users/johns/OneDrive/Desktop/scaffoldz anti/backend/sql/schema.sql'
\q
```

Alternatively, you can run the schema file directly:

```powershell
psql -U postgres -d final -f "C:\Users\johns\OneDrive\Desktop\scaffoldz anti\backend\sql\schema.sql"
```

### 3. Environment Configuration

The `.env` file has already been configured with your database credentials. If you need to modify any settings, edit the `.env` file.

## Running the Server

### Development Mode (with auto-reload)

```powershell
npm run dev
```

### Production Mode

```powershell
npm start
```

The server will run on **http://localhost:5000**

## API Endpoints

### Authentication
- `POST /api/auth/generate-otp` - Generate and send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user (protected)

### Users
- `POST /api/users` - Register new user
- `GET /api/users` - Get all users (management only)
- `GET /api/users/role/:role` - Get users by role

### Projects
- `GET /api/projects` - List projects (role-based filtering)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (customer only)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Bids
- `GET /api/bids/project/:projectId` - Get project bids
- `GET /api/bids/my-bids` - Get contractor's bids
- `POST /api/bids` - Submit bid (contractor only)
- `PUT /api/bids/:id/status` - Update bid status (management)

### Milestones
- `GET /api/milestones/project/:projectId` - Get project milestones
- `POST /api/milestones` - Create milestone
- `PUT /api/milestones/:id` - Update milestone

### Payments
- `GET /api/payments/project/:projectId` - Get project payments
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments` - Record payment

### Reports
- `GET /api/reports/project/:projectId` - Get project reports
- `GET /api/reports/:id` - Get report with photos
- `POST /api/reports` - Create daily report
- `POST /api/reports/:id/photos` - Add photos to report

### Materials
- `GET /api/materials/project/:projectId` - Get project materials
- `POST /api/materials` - Add material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Attendance
- `GET /api/attendance/project/:projectId` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance

### Messages
- `GET /api/messages/project/:projectId` - Get project messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read

## Database Schema

### Tables
- **users** - User accounts (customer, contractor, management)
- **otps** - Email OTP verification codes
- **projects** - Construction projects
- **bids** - Contractor quotations
- **milestones** - Project milestones
- **payments** - Payment records
- **reports** - Daily site reports
- **report_photos** - Report photo attachments
- **materials** - Material inventory
- **attendance** - Worker attendance logs
- **messages** - Project messaging
- **internal_notes** - Management notes

## Testing

### Health Check
```
GET http://localhost:5000/health
```

### Register a Test User
```powershell
curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"fullName\":\"Test User\",\"role\":\"customer\",\"phone\":\"1234567890\"}"
```

### Generate OTP
```powershell
curl -X POST http://localhost:5000/api/auth/generate-otp -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

In development mode, the OTP will be logged to the console.

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running: `Get-Service postgresql*`
- Check database credentials in `.env`
- Ensure database 'final' exists: `psql -U postgres -l`

### Email Not Working
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled on Gmail account
- In development, OTP is logged to console as fallback

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port 5000: `netstat -ano | findstr :5000`

## Project Structure

```
backend/
├── config/           # Database and JWT configuration
├── middleware/       # Authentication and error handling
├── routes/          # API route handlers
├── services/        # Email and other services
├── sql/             # Database schema
├── .env             # Environment configuration
├── .env.example     # Environment template
├── package.json     # Dependencies
└── server.js        # Main server file
```

## License

ISC
