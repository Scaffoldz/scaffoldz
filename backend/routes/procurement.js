const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

// ==========================================
// CONTRACTOR ROUTES
// ==========================================

// Create a new material request for a project
router.post('/requests', authenticate, async (req, res, next) => {
    try {
        const { projectId, materialType, quantity, unit, deadline } = req.body;
        const { id: contractorId, role } = req.user;

        if (role !== 'contractor') {
            return res.status(403).json({ error: 'Only contractors can create material requests.' });
        }

        if (!projectId || !materialType || !quantity || !unit || !deadline) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const result = await query(
            `INSERT INTO material_requests (project_id, contractor_id, material_type, quantity, unit, deadline)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [projectId, contractorId, materialType, quantity, unit, deadline]
        );

        res.status(201).json({ request: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Fetch all requests and nested quotations for a specific project
router.get('/requests/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        // Fetch requests for this project
        const requestsResult = await query(
            `SELECT * FROM material_requests WHERE project_id = $1 ORDER BY created_at DESC`,
            [projectId]
        );
        const requests = requestsResult.rows;

        if (requests.length === 0) {
            return res.json({ requests: [] });
        }

        // Fetch quotations for these requests
        const requestIds = requests.map(r => r.id);
        const placeholders = requestIds.map((_, i) => `$${i + 1}`).join(',');
        
        const quotationsResult = await query(
            `SELECT vq.*, u.company_name as vendor_name 
             FROM vendor_quotations vq
             JOIN users u ON vq.vendor_id = u.id
             WHERE vq.request_id IN (${placeholders})`,
            [...requestIds]
        );
        const quotations = quotationsResult.rows;

        // Group quotations back into requests
        const structuredRequests = requests.map(req => ({
            ...req,
            quotations: quotations.filter(q => q.request_id === req.id)
        }));

        res.json({ requests: structuredRequests });
    } catch (error) {
        next(error);
    }
});

// Fetch all requests across all projects for a contractor
router.get('/requests/contractor', authenticate, async (req, res, next) => {
    try {
        const { id: contractorId, role } = req.user;

        if (role !== 'contractor') {
            return res.status(403).json({ error: 'Only contractors can view these requests.' });
        }

        const requestsResult = await query(
            `SELECT mr.*, p.title as project_name 
             FROM material_requests mr
             JOIN projects p ON mr.project_id = p.id
             WHERE mr.contractor_id = $1 
             ORDER BY mr.created_at DESC`,
            [contractorId]
        );
        const requests = requestsResult.rows;

        if (requests.length === 0) {
            return res.json({ requests: [] });
        }

        const requestIds = requests.map(r => r.id);
        const placeholders = requestIds.map((_, i) => `$${i + 1}`).join(',');
        
        const quotationsResult = await query(
            `SELECT vq.*, u.company_name as vendor_name 
             FROM vendor_quotations vq
             JOIN users u ON vq.vendor_id = u.id
             WHERE vq.request_id IN (${placeholders})`,
            [...requestIds]
        );
        const quotations = quotationsResult.rows;

        const structuredRequests = requests.map(req => ({
            ...req,
            quotations: quotations.filter(q => q.request_id === req.id)
        }));

        res.json({ requests: structuredRequests });
    } catch (error) {
        next(error);
    }
});

// Approve a vendor quotation (Creates Supply Order & Closes Request)
router.put('/quotations/:id/approve', authenticate, async (req, res, next) => {
    try {
        const { id: quotationId } = req.params;
        const { id: contractorId, role } = req.user;

        if (role !== 'contractor') {
            return res.status(403).json({ error: 'Only contractors can approve quotes.' });
        }

        // 1. Get quotation details to gather necessary IDs
        const quoteCheck = await query(
            `SELECT vq.*, mr.project_id, mr.contractor_id 
             FROM vendor_quotations vq
             JOIN material_requests mr ON vq.request_id = mr.id
             WHERE vq.id = $1`,
            [quotationId]
        );

        if (quoteCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Quotation not found.' });
        }

        const quoteData = quoteCheck.rows[0];

        // Ensure the current user is the contractor who made the request
        if (quoteData.contractor_id !== contractorId) {
            return res.status(403).json({ error: 'Unauthorized to approve this request.' });
        }

        await query('BEGIN');

        // 2. Mark this quotation as Approved
        await query(
            `UPDATE vendor_quotations SET status = 'Approved' WHERE id = $1`,
            [quotationId]
        );

        // 3. Mark all other quotations for this request as Rejected
        await query(
            `UPDATE vendor_quotations SET status = 'Rejected' 
             WHERE request_id = $1 AND id != $2`,
            [quoteData.request_id, quotationId]
        );

        // 4. Mark Material Request as Closed
        await query(
            `UPDATE material_requests SET status = 'Closed' WHERE id = $1`,
            [quoteData.request_id]
        );

        // 5. Generate Supply Order
        const orderResult = await query(
            `INSERT INTO supply_orders (quotation_id, project_id, vendor_id, contractor_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [quotationId, quoteData.project_id, quoteData.vendor_id, contractorId]
        );

        await query('COMMIT');

        res.json({ 
            message: 'Quotation approved and supply order created.',
            order: orderResult.rows[0]
        });
    } catch (error) {
        await query('ROLLBACK');
        next(error);
    }
});


// ==========================================
// VENDOR ROUTES
// ==========================================

// Get all Open Material Requests (that the vendor hasn't already bid on)
router.get('/requests/open', authenticate, async (req, res, next) => {
    try {
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT mr.*, p.title as project_name, u.company_name as contractor_name
             FROM material_requests mr
             JOIN projects p ON mr.project_id = p.id
             JOIN users u ON mr.contractor_id = u.id
             WHERE mr.status = 'Open' 
             AND mr.id NOT IN (
                SELECT request_id FROM vendor_quotations WHERE vendor_id = $1
             )
             ORDER BY mr.deadline ASC`,
            [vendorId]
        );

        res.json({ requests: result.rows });
    } catch (error) {
        next(error);
    }
});

// Submit a quotation for a request
router.post('/quotations', authenticate, async (req, res, next) => {
    try {
        const { requestId, pricePerUnit, totalAmount, estimatedDeliveryTime, additionalNotes } = req.body;
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Only vendors can submit quotes.' });
        }

        if (!requestId || !pricePerUnit || !totalAmount || !estimatedDeliveryTime) {
            return res.status(400).json({ error: 'Missing required configuration.' });
        }

        const result = await query(
            `INSERT INTO vendor_quotations 
             (request_id, vendor_id, price_per_unit, total_amount, estimated_delivery_time, additional_notes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [requestId, vendorId, pricePerUnit, totalAmount, estimatedDeliveryTime, additionalNotes]
        );

        res.status(201).json({ quotation: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

// Fetch vendor's submitted quotations
router.get('/quotations/vendor', authenticate, async (req, res, next) => {
    try {
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT vq.*, mr.material_type, mr.quantity, mr.unit, p.title as project_name, u.company_name as contractor_name
             FROM vendor_quotations vq
             JOIN material_requests mr ON vq.request_id = mr.id
             JOIN projects p ON mr.project_id = p.id
             JOIN users u ON mr.contractor_id = u.id
             WHERE vq.vendor_id = $1
             ORDER BY vq.submitted_at DESC`,
            [vendorId]
        );

        res.json({ quotations: result.rows });
    } catch (error) {
        next(error);
    }
});

// Fetch vendor's supply orders
router.get('/orders/vendor', authenticate, async (req, res, next) => {
    try {
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT so.*, mr.material_type, mr.quantity, mr.unit, p.title as project_name,
             u.company_name as contractor_name, vq.total_amount
             FROM supply_orders so
             JOIN vendor_quotations vq ON so.quotation_id = vq.id
             JOIN material_requests mr ON vq.request_id = mr.id
             JOIN projects p ON so.project_id = p.id
             JOIN users u ON so.contractor_id = u.id
             WHERE so.vendor_id = $1
             ORDER BY so.created_at DESC`,
            [vendorId]
        );

        res.json({ orders: result.rows });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// SUGGESTION ROUTES (Customer -> Contractor)
// ==========================================

// Get all suggestions for a project
router.get('/suggestions/:projectId', authenticate, async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const result = await query(
            `SELECT ps.*, u.full_name as author_name, u.role as author_role
             FROM procurement_suggestions ps
             JOIN users u ON ps.customer_id = u.id
             WHERE ps.project_id = $1
             ORDER BY ps.created_at DESC`,
            [projectId]
        );

        res.json({ suggestions: result.rows });
    } catch (error) {
        next(error);
    }
});

// Post a suggestion (customer only)
router.post('/suggestions', authenticate, async (req, res, next) => {
    try {
        const { projectId, suggestionText } = req.body;
        const { id: customerId, role } = req.user;

        if (role !== 'customer') {
            return res.status(403).json({ error: 'Only customers can post suggestions.' });
        }

        if (!projectId || !suggestionText || !suggestionText.trim()) {
            return res.status(400).json({ error: 'Project ID and suggestion text are required.' });
        }

        const result = await query(
            `INSERT INTO procurement_suggestions (project_id, customer_id, suggestion_text)
             VALUES ($1, $2, $3) RETURNING *`,
            [projectId, customerId, suggestionText.trim()]
        );

        res.status(201).json({ suggestion: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
