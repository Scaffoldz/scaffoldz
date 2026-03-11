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

// Create daily report — auto-detects milestones from report text
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, reportDate, workDone, labourCount, materialsUsed, remarks, dailyCost } = req.body;
        const submittedBy = req.user.id;

        if (!projectId || !reportDate || !workDone) {
            return res.status(400).json({ error: 'Project ID, report date, and work done are required' });
        }

        // 1. Save the report
        const result = await query(
            `INSERT INTO reports (project_id, submitted_by, report_date, work_done, labour_count, materials_used, remarks, daily_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [projectId, submittedBy, reportDate, workDone, labourCount, materialsUsed, remarks, dailyCost || 0]
        );
        const report = result.rows[0];

        // 2. Run AI milestone detection on the combined report text
        const { detectMilestones } = require('../services/milestoneDetector');
        const fullText = [workDone, materialsUsed || '', remarks || ''].join(' ');
        const detections = detectMilestones(fullText);

        const updatedMilestones = [];
        if (detections.length > 0) {
            // 3. Fetch existing project milestones
            const milestonesResult = await query(
                'SELECT * FROM milestones WHERE project_id = $1',
                [projectId]
            );
            const dbMilestones = milestonesResult.rows;

            for (const detection of detections) {
                const normalise = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
                const matched = dbMilestones.find(m => {
                    const dbTitle = normalise(m.title);
                    const detLabel = normalise(detection.label);
                    return dbTitle.includes(detLabel) || detLabel.includes(dbTitle) ||
                        detLabel.split(' ').some(word => word.length > 4 && dbTitle.includes(word));
                });

                if (matched) {
                    // Milestone exists — only upgrade status, never downgrade Completed
                    if (matched.status !== 'Completed' && matched.status !== detection.status) {
                        const updateFields = [`status = $1`];
                        const updateVals = [detection.status];
                        if (detection.status === 'Completed') {
                            updateFields.push('completed_at = CURRENT_TIMESTAMP');
                        }
                        updateVals.push(matched.id);
                        await query(
                            `UPDATE milestones SET ${updateFields.join(', ')} WHERE id = $${updateVals.length} RETURNING *`,
                            updateVals
                        );
                        updatedMilestones.push({
                            milestoneId: matched.id,
                            title: matched.title,
                            newStatus: detection.status,
                            confidence: detection.confidence,
                            action: 'updated',
                        });
                    }
                } else {
                    // Milestone does NOT exist — create it automatically
                    const createFields = detection.status === 'Completed'
                        ? `INSERT INTO milestones (project_id, title, status, completed_at)
                           VALUES ($1, $2, $3, NOW()) RETURNING *`
                        : `INSERT INTO milestones (project_id, title, status)
                           VALUES ($1, $2, $3) RETURNING *`;

                    const created = await query(createFields, [projectId, detection.label, detection.status]);
                    // Add to dbMilestones so subsequent detections in the same report don't re-create it
                    dbMilestones.push(created.rows[0]);
                    updatedMilestones.push({
                        milestoneId: created.rows[0].id,
                        title: detection.label,
                        newStatus: detection.status,
                        confidence: detection.confidence,
                        action: 'created',
                    });
                }
            }

            // 4. Log detections to project_history
            for (const det of updatedMilestones) {
                try {
                    await query(
                        `INSERT INTO project_history (project_id, event_type, description, created_by, created_at)
                         VALUES ($1, $2, $3, $4, NOW())`,
                        [
                            projectId,
                            'milestone_auto_updated',
                            `AI detected "${det.title}" as ${det.newStatus} (confidence: ${(det.confidence * 100).toFixed(0)}%) from daily report #${report.id}`,
                            submittedBy
                        ]
                    ).catch(() => { }); // non-fatal if project_history table doesn't exist
                } catch { }
            }
        }

        res.status(201).json({
            message: 'Report created successfully',
            report,
            aiDetections: detections,
            updatedMilestones,
        });
    } catch (error) {
        next(error);
    }
});

// Re-analyse an existing report for milestones (management can trigger manually)
router.post('/:id/analyze', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const reportResult = await query('SELECT * FROM reports WHERE id = $1', [id]);
        if (reportResult.rows.length === 0) return res.status(404).json({ error: 'Report not found' });

        const report = reportResult.rows[0];
        const { detectMilestones } = require('../services/milestoneDetector');
        const fullText = [report.work_done, report.materials_used || '', report.remarks || ''].join(' ');
        const detections = detectMilestones(fullText);

        res.json({ reportId: id, detections });
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

// Get daily costs for a project (for graphing)
router.get('/project/:projectId/daily', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const result = await query(
            `SELECT report_date, daily_cost, work_done
             FROM reports
             WHERE project_id = $1
             ORDER BY report_date ASC`,
            [projectId]
        );
        res.json({ dailyCosts: result.rows });
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
