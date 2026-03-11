const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken } = require('../config/jwt');
const { generateOTP, sendOTP } = require('../services/email');
const { authenticate } = require('../middleware/auth');

// Generate and send OTP
router.post('/generate-otp', async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        // Check if user exists
        const userResult = await query(
            'SELECT id, password_hash, role FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Validate that the requested role matches the db account role
        if (user.role !== role) {
            const roleLabels = {
                customer: "Customer",
                contractor: "Contractor",
                vendor: "Vendor",
                management: "Management",
            };
            return res.status(401).json({ 
                error: `Selected role does not match your account. Expected: ${roleLabels[user.role] || user.role}.` 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

        // Store OTP in database
        await query(
            'INSERT INTO otps (email, otp_code, expires_at) VALUES ($1, $2, $3)',
            [email, otp, expiresAt]
        );

        // Send OTP via email
        try {
            await sendOTP(email, otp);
            res.json({
                message: 'OTP sent to your email successfully',
                expiresIn: `${expiryMinutes} minutes`
            });
        } catch (emailError) {
            // In development, still return success and log OTP
            if (process.env.NODE_ENV === 'development') {
                console.log('🔑 [DEV MODE] OTP:', otp);
                res.json({
                    message: 'OTP generated (check console in dev mode)',
                    expiresIn: `${expiryMinutes} minutes`,
                    dev_otp: otp // Only in development
                });
            } else {
                throw emailError;
            }
        }
    } catch (error) {
        next(error);
    }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        // Find valid OTP
        const otpResult = await query(
            'SELECT * FROM otps WHERE email = $1 AND otp_code = $2 AND verified = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
            [email, otp]
        );

        if (otpResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // Mark OTP as verified
        await query(
            'UPDATE otps SET verified = true WHERE id = $1',
            [otpResult.rows[0].id]
        );

        // Get user details
        const userResult = await query(
            'SELECT id, email, full_name, role, phone, company_name FROM users WHERE email = $1',
            [email]
        );

        const user = userResult.rows[0];

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                role: user.role,
                phone: user.phone,
                companyName: user.company_name
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get current user (protected route)
router.get('/me', authenticate, async (req, res, next) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
