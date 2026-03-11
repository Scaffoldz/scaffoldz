const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Register new user
router.post('/', async (req, res, next) => {
    try {
        const { email, password, fullName, role, phone, companyName, experienceYears } = req.body;

        // Validate required fields
        if (!email || !password || !fullName || !role) {
            return res.status(400).json({ error: 'Email, password, full name, and role are required' });
        }

        // Validate role
        if (!['customer', 'contractor', 'management', 'vendor'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name, role, phone, company_name, experience_years) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, full_name, role, phone, company_name, created_at`,
            [email, passwordHash, fullName, role, phone, companyName, experienceYears]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ error: 'Email already registered' });
        }
        next(error);
    }
});

// Get all users (management only)
router.get('/', authenticate, authorize('management'), async (req, res, next) => {
    try {
        const result = await query(
            'SELECT id, email, full_name, role, phone, company_name, experience_years, created_at FROM users ORDER BY created_at DESC'
        );

        res.json({ users: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get users by role
router.get('/role/:role', authenticate, async (req, res, next) => {
    try {
        const { role } = req.params;

        const result = await query(
            'SELECT id, email, full_name, role, phone, company_name, experience_years FROM users WHERE role = $1 ORDER BY full_name',
            [role]
        );

        res.json({ users: result.rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
