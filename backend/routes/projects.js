const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all projects (role-based filtering)
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { role, id: userId } = req.user;
        const { status } = req.query;

        let queryText;
        let params = [];

        if (role === 'customer') {
            // Customers see only their projects
            queryText = `
        SELECT p.*, 
               u.full_name as customer_name,
               c.full_name as contractor_name,
               (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bid_count
        FROM projects p
        LEFT JOIN users u ON p.customer_id = u.id
        LEFT JOIN users c ON p.assigned_contractor_id = c.id
        WHERE p.customer_id = $1
      `;
            params = [userId];
        } else if (role === 'contractor') {
            // Contractors see projects assigned to them or open for bidding
            queryText = `
        SELECT p.*,
               u.full_name as customer_name,
               c.full_name as contractor_name
        FROM projects p
        LEFT JOIN users u ON p.customer_id = u.id
        LEFT JOIN users c ON p.assigned_contractor_id = c.id
        WHERE p.assigned_contractor_id = $1 OR p.status IN ('Bidding', 'Under Review')
      `;
            params = [userId];
        } else {
            // Management sees all projects
            queryText = `
        SELECT p.*,
               u.full_name as customer_name,
               c.full_name as contractor_name
        FROM projects p
        LEFT JOIN users u ON p.customer_id = u.id
        LEFT JOIN users c ON p.assigned_contractor_id = c.id
      `;
        }

        // Add status filter if provided
        if (status) {
            queryText += ` ${params.length > 0 ? 'AND' : 'WHERE'} p.status = $${params.length + 1}`;
            params.push(status);
        }

        queryText += ' ORDER BY p.created_at DESC';

        const result = await query(queryText, params);

        res.json({ projects: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get single project
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT p.*,
              u.full_name as customer_name, u.email as customer_email, u.phone as customer_phone,
              c.full_name as contractor_name, c.email as contractor_email, c.phone as contractor_phone,
              (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bid_count
       FROM projects p
       LEFT JOIN users u ON p.customer_id = u.id
       LEFT JOIN users c ON p.assigned_contractor_id = c.id
       WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Create new project (customer only)
router.post('/', authenticate, authorize('customer'), async (req, res, next) => {
    try {
        const { title, description, location, budget, startDate, deadline } = req.body;
        const customerId = req.user.id;

        if (!title || !location) {
            return res.status(400).json({ error: 'Title and location are required' });
        }

        const result = await query(
            `INSERT INTO projects (title, description, location, budget, start_date, deadline, customer_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Submitted')
       RETURNING *`,
            [title, description, location, budget, startDate, deadline, customerId]
        );

        res.status(201).json({
            message: 'Project created successfully',
            project: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Update project
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, location, budget, startDate, deadline, bidding_deadline, status, assignedContractorId } = req.body;
        const { role, id: userId } = req.user;

        // Check if project exists and user has permission
        const projectResult = await query('SELECT * FROM projects WHERE id = $1', [id]);

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = projectResult.rows[0];

        // Only customer who owns the project or management can update
        if (role === 'customer' && project.customer_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Build update query dynamically
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
        if (location !== undefined) {
            updates.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (budget !== undefined) {
            updates.push(`budget = $${paramCount++}`);
            values.push(budget);
        }
        if (startDate !== undefined) {
            updates.push(`start_date = $${paramCount++}`);
            values.push(startDate);
        }
        if (deadline !== undefined) {
            updates.push(`deadline = $${paramCount++}`);
            values.push(deadline);
        }
        if (bidding_deadline !== undefined) {
            updates.push(`bidding_deadline = $${paramCount++}`);
            values.push(bidding_deadline);
        }
        if (status !== undefined && role === 'management') {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
        }
        if (assignedContractorId !== undefined && role === 'management') {
            updates.push(`assigned_contractor_id = $${paramCount++}`);
            values.push(assignedContractorId);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const result = await query(
            `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json({
            message: 'Project updated successfully',
            project: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Delete project (customer or management only)
router.delete('/:id', authenticate, authorize('customer', 'management'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, id: userId } = req.user;

        // Check if project exists
        const projectResult = await query('SELECT * FROM projects WHERE id = $1', [id]);

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const project = projectResult.rows[0];

        // Only customer who owns the project or management can delete
        if (role === 'customer' && project.customer_id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await query('DELETE FROM projects WHERE id = $1', [id]);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
