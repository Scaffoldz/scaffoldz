const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Get messages for a project filtered by channel
// channel: 'customer_management' or 'management_contractor'
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { channel } = req.query;

        let sql = `SELECT m.*, u.full_name as sender_name, u.role as sender_role
                   FROM messages m
                   LEFT JOIN users u ON m.sender_id = u.id
                   WHERE m.project_id = $1`;
        const params = [projectId];

        if (channel) {
            sql += ` AND m.channel = $2`;
            params.push(channel);
        }

        sql += ` ORDER BY m.created_at ASC`;

        const result = await query(sql, params);
        res.json({ messages: result.rows });
    } catch (error) {
        next(error);
    }
});

// Send message
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { projectId, message, channel } = req.body;
        const senderId = req.user.id;

        if (!projectId || !message) {
            return res.status(400).json({ error: 'Project ID and message are required' });
        }

        // Determine channel automatically based on sender role if not provided
        const msgChannel = channel || (
            req.user.role === 'contractor' ? 'management_contractor' : 'customer_management'
        );

        const result = await query(
            `INSERT INTO messages (project_id, sender_id, message, channel)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [projectId, senderId, message, msgChannel]
        );

        const messageWithSender = await query(
            `SELECT m.*, u.full_name as sender_name, u.role as sender_role
             FROM messages m
             LEFT JOIN users u ON m.sender_id = u.id
             WHERE m.id = $1`,
            [result.rows[0].id]
        );

        res.status(201).json({
            message: 'Message sent successfully',
            messageData: messageWithSender.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Mark message as read
router.put('/:id/read', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(
            'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message marked as read', messageData: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
