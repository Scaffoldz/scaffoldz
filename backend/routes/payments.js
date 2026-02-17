const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get payments for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            `SELECT p.*, m.title as milestone_title
       FROM payments p
       LEFT JOIN milestones m ON p.milestone_id = m.id
       WHERE p.project_id = $1
       ORDER BY p.created_at DESC`,
            [projectId]
        );

        res.json({ payments: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get single payment
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT p.*, m.title as milestone_title, pr.title as project_title
       FROM payments p
       LEFT JOIN milestones m ON p.milestone_id = m.id
       LEFT JOIN projects pr ON p.project_id = pr.id
       WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        res.json({ payment: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Record payment
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, milestoneId, amount, paymentMethod, transactionId } = req.body;

        if (!projectId || !amount) {
            return res.status(400).json({ error: 'Project ID and amount are required' });
        }

        const result = await query(
            `INSERT INTO payments (project_id, milestone_id, amount, payment_method, transaction_id, status, paid_at)
       VALUES ($1, $2, $3, $4, $5, 'Completed', CURRENT_TIMESTAMP)
       RETURNING *`,
            [projectId, milestoneId, amount, paymentMethod, transactionId]
        );

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
