const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get attendance for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { startDate, endDate } = req.query;

        let queryText = 'SELECT * FROM attendance WHERE project_id = $1';
        const params = [projectId];

        if (startDate) {
            queryText += ' AND attendance_date >= $2';
            params.push(startDate);
        }
        if (endDate) {
            queryText += ` AND attendance_date <= $${params.length + 1}`;
            params.push(endDate);
        }

        queryText += ' ORDER BY attendance_date DESC, worker_name';

        const result = await query(queryText, params);

        res.json({ attendance: result.rows });
    } catch (error) {
        next(error);
    }
});

// Mark attendance
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, workerName, workerType, attendanceDate, hoursWorked, wagePerHour, totalWage, remarks } = req.body;

        if (!projectId || !workerName || !attendanceDate) {
            return res.status(400).json({ error: 'Project ID, worker name, and attendance date are required' });
        }

        const result = await query(
            `INSERT INTO attendance (project_id, worker_name, worker_type, attendance_date, hours_worked, wage_per_hour, total_wage, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [projectId, workerName, workerType, attendanceDate, hoursWorked, wagePerHour, totalWage, remarks]
        );

        res.status(201).json({
            message: 'Attendance marked successfully',
            attendance: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Update attendance
router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { hoursWorked, wagePerHour, totalWage, remarks } = req.body;

        const updates = [];
        const values = [];
        let paramCount = 1;

        if (hoursWorked !== undefined) {
            updates.push(`hours_worked = $${paramCount++}`);
            values.push(hoursWorked);
        }
        if (wagePerHour !== undefined) {
            updates.push(`wage_per_hour = $${paramCount++}`);
            values.push(wagePerHour);
        }
        if (totalWage !== undefined) {
            updates.push(`total_wage = $${paramCount++}`);
            values.push(totalWage);
        }
        if (remarks !== undefined) {
            updates.push(`remarks = $${paramCount++}`);
            values.push(remarks);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const result = await query(
            `UPDATE attendance SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        res.json({
            message: 'Attendance updated successfully',
            attendance: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
