const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get milestones for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            'SELECT * FROM milestones WHERE project_id = $1 ORDER BY due_date ASC',
            [projectId]
        );

        res.json({ milestones: result.rows });
    } catch (error) {
        next(error);
    }
});

// Create milestone
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, title, description, amount, dueDate } = req.body;

        if (!projectId || !title) {
            return res.status(400).json({ error: 'Project ID and title are required' });
        }

        const result = await query(
            `INSERT INTO milestones (project_id, title, description, amount, due_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [projectId, title, description, amount, dueDate]
        );

        res.status(201).json({
            message: 'Milestone created successfully',
            milestone: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Update milestone
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, amount, status, dueDate } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(title);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (amount !== undefined) {
            updates.push(`amount = $${paramCount++}`);
            values.push(amount);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
            if (status === 'Completed') {
                updates.push(`completed_at = CURRENT_TIMESTAMP`);
            }
        }
        if (dueDate !== undefined) {
            updates.push(`due_date = $${paramCount++}`);
            values.push(dueDate);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const result = await query(
            `UPDATE milestones SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        res.json({
            message: 'Milestone updated successfully',
            milestone: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
