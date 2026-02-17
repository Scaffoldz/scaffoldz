const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all bids for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            `SELECT b.*, u.full_name as contractor_name, u.company_name, u.experience_years
       FROM bids b
       JOIN users u ON b.contractor_id = u.id
       WHERE b.project_id = $1
       ORDER BY b.amount ASC`,
            [projectId]
        );

        res.json({ bids: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get contractor's own bids
router.get('/my-bids', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const contractorId = req.user.id;

        const result = await query(
            `SELECT b.*, p.title as project_title, p.location, p.status as project_status
       FROM bids b
       JOIN projects p ON b.project_id = p.id
       WHERE b.contractor_id = $1
       ORDER BY b.submitted_at DESC`,
            [contractorId]
        );

        res.json({ bids: result.rows });
    } catch (error) {
        next(error);
    }
});

// Submit a bid (contractor only)
router.post('/', authenticate, authorize('contractor'), async (req, res, next) => {
    try {
        const { projectId, amount, durationMonths, proposal } = req.body;
        const contractorId = req.user.id;

        if (!projectId || !amount) {
            return res.status(400).json({ error: 'Project ID and amount are required' });
        }

        // Check if project exists and is open for bidding
        const projectResult = await query(
            'SELECT * FROM projects WHERE id = $1',
            [projectId]
        );

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const result = await query(
            `INSERT INTO bids (project_id, contractor_id, amount, duration_months, proposal)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [projectId, contractorId, amount, durationMonths, proposal]
        );

        res.status(201).json({
            message: 'Bid submitted successfully',
            bid: result.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ error: 'You have already submitted a bid for this project' });
        }
        next(error);
    }
});

// Update bid status (management only)
router.put('/:id/status', authenticate, authorize('management'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Selected', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await query(
            'UPDATE bids SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        // If bid is selected, update project
        if (status === 'Selected') {
            const bid = result.rows[0];
            await query(
                'UPDATE projects SET assigned_contractor_id = $1, status = $2 WHERE id = $3',
                [bid.contractor_id, 'Assigned', bid.project_id]
            );
        }

        res.json({
            message: 'Bid status updated successfully',
            bid: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
