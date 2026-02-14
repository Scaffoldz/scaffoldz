# Authentication System with Email OTP Verification

A modern, full-stack authentication system with email OTP verification supporting three user roles: **Customer**, **Management**, and **Contractor**.

## ✨ Features

- 🔐 **Secure Authentication** - Password hashing with bcrypt
- 📧 **Email OTP Verification** - 6-digit OTP codes sent via email
- 👥 **Multi-Role Support** - Customer, Management, and Contractor roles
- 🎨 **Premium UI** - Modern glassmorphism design with smooth animations
- 📱 **Responsive Design** - Works beautifully on all devices
- ⚡ **Fast Development** - React with Vite for instant hot reload
- 🔄 **Resend OTP** - Users can request new OTP codes

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Email account with SMTP access (Gmail, SendGrid, etc.)

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd c:\Joyals\Grace\proj
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Configuration

1. **Set up email configuration**
   
   Copy the example environment file:
   ```bash
   copy server\.env.example server\.env
   ```

2. **Edit `server/.env` with your email credentials**

   For **Gmail**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   PORT=3000
   ```

   > **Note**: For Gmail, you need to:
   > 1. Enable 2-Factor Authentication
   > 2. Generate an App Password at https://myaccount.google.com/apppasswords
   > 3. Use the app password in `EMAIL_PASS`

   For testing, you can use **Mailtrap**:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASS=your-mailtrap-password
   ```

### Running the Application

1. **Start the backend server** (in one terminal):
   ```bash
   cd server
   npm start
   ```
   The server will run on http://localhost:3000

2. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:7070

3. **Open your browser** and navigate to:
   ```
   http://localhost:7070
   ```

## 📖 Usage

### Sign Up Flow

1. Click on the Sign Up page (default landing page)
2. Enter your email address
3. Create a password (minimum 6 characters)
4. Select your role: Customer, Management, or Contractor
5. Click "Continue"
6. Check your email for the 6-digit OTP code
7. Enter the OTP code in the verification screen
8. Click "Verify Email" to complete registration

### Login Flow

1. Navigate to the Login page
2. Enter your registered email and password
3. Click "Continue"
4. Check your email for the 6-digit OTP code
5. Enter the OTP code
6. Click "Verify & Login"
7. You'll see your role displayed after successful login

### Resend OTP

If you don't receive the OTP or it expires:
- Click the "Resend OTP" link on the verification screen
- A new OTP will be sent to your email

## 🏗️ Project Structure

```
proj/
├── server/                 # Backend API
│   ├── index.js           # Express server with OTP logic
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Email configuration template
├── src/
│   ├── pages/
│   │   ├── SignUp.jsx     # Sign up component
│   │   └── Login.jsx      # Login component
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles & design system
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
└── package.json           # Frontend dependencies
```

## 🎨 Design Features

- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** with smooth animations
- **Modern typography** using Inter font
- **Responsive layouts** for mobile and desktop
- **Micro-animations** for enhanced UX
- **Role-based color coding** for visual distinction

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- OTP expiration (5 minutes)
- Secure email delivery
- Input validation on both frontend and backend
- Protection against common vulnerabilities

## 🛠️ Technologies Used

**Frontend:**
- React 18
- Vite 5
- CSS3 with custom properties

**Backend:**
- Node.js
- Express 4
- Nodemailer (email service)
- bcrypt (password hashing)
- dotenv (environment variables)

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signup` | POST | Register new user and send OTP |
| `/api/verify-signup-otp` | POST | Verify OTP and create account |
| `/api/login` | POST | Authenticate user and send OTP |
| `/api/verify-login-otp` | POST | Verify OTP and complete login |
| `/api/resend-otp` | POST | Resend OTP code |

## 🐛 Troubleshooting

### OTP emails not sending

1. **Check email configuration** in `server/.env`
2. **Verify SMTP credentials** are correct
3. **Enable less secure apps** (for Gmail) or use app-specific password
4. **Check server logs** for error messages
5. **Try Mailtrap** for testing without real emails

### Port already in use

Change the port in:
- Backend: Edit `PORT` in `server/.env`
- Frontend: Edit `server.port` in `vite.config.js`

### Dependencies not installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
rmdir /s /q server\node_modules
npm install
cd server && npm install
```

## 🚀 Production Deployment

Before deploying to production:

1. **Add a database** (MongoDB, PostgreSQL, etc.) instead of in-memory storage
2. **Secure environment variables** using proper secret management
3. **Add HTTPS** for secure communication
4. **Implement rate limiting** to prevent abuse
5. **Add session management** with JWT tokens
6. **Set up proper logging** and monitoring
7. **Configure CORS** appropriately for your domain

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

---

Built with ❤️ using React, Node.js, and modern web technologies
