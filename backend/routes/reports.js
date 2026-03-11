const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get reports for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            `SELECT r.*, u.full_name as submitted_by_name,
              (SELECT COUNT(*) FROM report_photos WHERE report_id = r.id) as photo_count
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       WHERE r.project_id = $1
       ORDER BY r.report_date DESC`,
            [projectId]
        );

        res.json({ reports: result.rows });
    } catch (error) {
        next(error);
    }
});

// Get single report with photos
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const reportResult = await query(
            `SELECT r.*, u.full_name as submitted_by_name
       FROM reports r
       LEFT JOIN users u ON r.submitted_by = u.id
       WHERE r.id = $1`,
            [id]
        );

        if (reportResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const photosResult = await query(
            'SELECT * FROM report_photos WHERE report_id = $1 ORDER BY uploaded_at',
            [id]
        );

        res.json({
            report: {
                ...reportResult.rows[0],
                photos: photosResult.rows
            }
        });
    } catch (error) {
        next(error);
    }
});

// Create daily report
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, reportDate, workDone, labourCount, materialsUsed, remarks, dailyCost } = req.body;
        const submittedBy = req.user.id;

        if (!projectId || !reportDate || !workDone) {
            return res.status(400).json({ error: 'Project ID, report date, and work done are required' });
        }

        const result = await query(
            `INSERT INTO reports (project_id, submitted_by, report_date, work_done, labour_count, materials_used, remarks, daily_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [projectId, submittedBy, reportDate, workDone, labourCount, materialsUsed, remarks, dailyCost || 0]
        );

        res.status(201).json({
            message: 'Report created successfully',
            report: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Get actual total cost spent on a project (sum of all daily report costs)
router.get('/project/:projectId/actual-cost', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const result = await query(
            `SELECT COALESCE(SUM(daily_cost), 0) as actual_cost, COUNT(*) as report_count
             FROM reports WHERE project_id = $1`,
            [projectId]
        );
        res.json({
            actualCost: Number(result.rows[0].actual_cost),
            reportCount: Number(result.rows[0].report_count)
        });
    } catch (error) {
        next(error);
    }
});

// Add photos to report
router.post('/:id/photos', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { photoUrl, caption } = req.body;

        if (!photoUrl) {
            return res.status(400).json({ error: 'Photo URL is required' });
        }

        const result = await query(
            'INSERT INTO report_photos (report_id, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
            [id, photoUrl, caption]
        );

        res.status(201).json({
            message: 'Photo added successfully',
            photo: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
