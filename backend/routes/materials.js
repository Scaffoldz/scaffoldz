const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get materials for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            'SELECT * FROM materials WHERE project_id = $1 ORDER BY delivery_date DESC, created_at DESC',
            [projectId]
        );

        res.json({ materials: result.rows });
    } catch (error) {
        next(error);
    }
});

// Add material
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, materialName, quantity, unit, costPerUnit, totalCost, supplier, deliveryDate, status } = req.body;

        if (!projectId || !materialName) {
            return res.status(400).json({ error: 'Project ID and material name are required' });
        }

        const result = await query(
            `INSERT INTO materials (project_id, material_name, quantity, unit, cost_per_unit, total_cost, supplier, delivery_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [projectId, materialName, quantity, unit, costPerUnit, totalCost, supplier, deliveryDate, status || 'Ordered']
        );

        res.status(201).json({
            message: 'Material added successfully',
            material: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Update material
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { materialName, quantity, unit, costPerUnit, totalCost, supplier, deliveryDate, status } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (materialName !== undefined) {
            updates.push(`material_name = $${paramCount++}`);
            values.push(materialName);
        }
        if (quantity !== undefined) {
            updates.push(`quantity = $${paramCount++}`);
            values.push(quantity);
        }
        if (unit !== undefined) {
            updates.push(`unit = $${paramCount++}`);
            values.push(unit);
        }
        if (costPerUnit !== undefined) {
            updates.push(`cost_per_unit = $${paramCount++}`);
            values.push(costPerUnit);
        }
        if (totalCost !== undefined) {
            updates.push(`total_cost = $${paramCount++}`);
            values.push(totalCost);
        }
        if (supplier !== undefined) {
            updates.push(`supplier = $${paramCount++}`);
            values.push(supplier);
        }
        if (deliveryDate !== undefined) {
            updates.push(`delivery_date = $${paramCount++}`);
            values.push(deliveryDate);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramCount++}`);
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const result = await query(
            `UPDATE materials SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }

        res.json({
            message: 'Material updated successfully',
            material: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Delete material
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM materials WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }

        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
