const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all labour workers for a project (Contractor only)
router.get('/project/:projectId', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const contractorId = req.user.id;

        const result = await query(
            'SELECT * FROM labour_workers WHERE project_id = $1 AND contractor_id = $2 ORDER BY created_at DESC',
            [projectId, contractorId]
        );

        res.json({ workers: result.rows });
    } catch (error) {
        next(error);
    }
});

// Add a new labour worker
router.post('/', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const { projectId, name, role, dailyWage } = req.body;
        const contractorId = req.user.id;

        if (!projectId || !name || !role || !dailyWage) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await query(
            `INSERT INTO labour_workers (project_id, contractor_id, name, role, daily_wage)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [projectId, contractorId, name, role, dailyWage]
        );

        res.status(201).json({
            message: 'Worker added successfully',
            worker: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Update worker status or details
router.put('/:id', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, dailyWage, status } = req.body;
        const contractorId = req.user.id;

        const result = await query(
            `UPDATE labour_workers 
             SET name = COALESCE($1, name), 
                 role = COALESCE($2, role), 
                 daily_wage = COALESCE($3, daily_wage), 
                 status = COALESCE($4, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 AND contractor_id = $6
             RETURNING *`,
            [name, role, dailyWage, status, id, contractorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Worker not found or unauthorized' });
        }

        res.json({
            message: 'Worker updated successfully',
            worker: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Delete a worker
router.delete('/:id', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const contractorId = req.user.id;

        const result = await query(
            'DELETE FROM labour_workers WHERE id = $1 AND contractor_id = $2 RETURNING *',
            [id, contractorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Worker not found or unauthorized' });
        }

        res.json({ message: 'Worker deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
