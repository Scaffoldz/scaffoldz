const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error);
    } else {
        console.log('✅ Email service is ready');
    }
});

// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your Scaffoldz OTP Code',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Scaffoldz Construction Platform</h2>
        <p>Your One-Time Password (OTP) for login is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
        <p style="color: #6b7280; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✉️  Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        // In development, log OTP to console
        if (process.env.NODE_ENV === 'development') {
            console.log('🔑 [DEV MODE] OTP for', email, ':', otp);
        }
        throw error;
    }
};

module.exports = {
    generateOTP,
    sendOTP
};
