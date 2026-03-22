const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Generate a unique bill number
function generateBillNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL-${timestamp}-${random}`;
}

// ==========================================
// VENDOR ROUTES
// ==========================================

// POST /api/bills/generate — Vendor generates a bill using Gemini AI
router.post('/generate', authenticate, async (req, res, next) => {
    try {
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Only vendors can generate bills.' });
        }

        // Validate key exists and isn't the placeholder
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
            return res.status(500).json({ error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env and restart the server.' });
        }

        // Instantiate here so it always reads the latest env value
        const genAI = new GoogleGenerativeAI(apiKey);

        const { projectId, supplyOrderId, items, notes } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'At least one bill item is required.' });
        }

        // Calculate amounts
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);
        const taxRate = 0.18; // 18% GST
        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + taxAmount;

        // Fetch vendor details
        const vendorResult = await query(
            `SELECT u.full_name, u.company_name, u.email FROM users u WHERE u.id = $1`,
            [vendorId]
        );
        const vendor = vendorResult.rows[0] || {};

        // Fetch project details if provided
        let project = null;
        if (projectId) {
            const projectResult = await query(`SELECT title, location FROM projects WHERE id = $1`, [projectId]);
            project = projectResult.rows[0] || null;
        }

        // Construct Gemini AI prompt
        const prompt = `You are a professional billing assistant for a construction supply company in India. 
Generate a formal, professional bill in a structured text format for the following supply transaction.

Vendor Details:
- Company/Name: ${vendor.company_name || vendor.full_name || 'Vendor Company'}
- Email: ${vendor.email || 'N/A'}

${project ? `Project Details:
- Project Name: ${project.title}
- Location: ${project.location}
` : ''}

Bill Items:
${items.map((item, i) => `${i + 1}. ${item.name} — Qty: ${item.quantity} ${item.unit || 'pcs'} @ ₹${item.unitPrice}/${item.unit || 'pcs'} = ₹${(parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2)}`).join('\n')}

Financial Summary:
- Subtotal: ₹${subtotal.toFixed(2)}
- GST (18%): ₹${taxAmount.toFixed(2)}
- Total Amount: ₹${totalAmount.toFixed(2)}

${notes ? `Additional Notes: ${notes}` : ''}

Please generate a professional bill document that includes:
1. A formal bill header with the company name
2. Bill date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
3. A clearly formatted itemized table
4. Financial summary with GST breakdown
5. Payment terms (Net 30 days)
6. A professional closing note

Keep it concise, formal, and suitable for construction industry use in India. Format it nicely with separators.`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const billContent = result.response.text();

        const billNumber = generateBillNumber();

        // Save bill to database
        const billResult = await query(
            `INSERT INTO bills 
             (vendor_id, project_id, supply_order_id, bill_number, bill_content, items, subtotal, tax_amount, total_amount, status, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Sent', $10)
             RETURNING *`,
            [
                vendorId,
                projectId || null,
                supplyOrderId || null,
                billNumber,
                billContent,
                JSON.stringify(items),
                subtotal.toFixed(2),
                taxAmount.toFixed(2),
                totalAmount.toFixed(2),
                notes || null
            ]
        );

        const savedBill = billResult.rows[0];

        res.status(201).json({
            message: 'Bill generated successfully.',
            bill: {
                ...savedBill,
                vendor_name: vendor.company_name || vendor.full_name,
                project_name: project ? project.title : null
            }
        });

    } catch (error) {
        console.error('Bill generation error:', error);
        if (error.message && error.message.includes('API_KEY')) {
            return res.status(500).json({ error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.' });
        }
        next(error);
    }
});

// GET /api/bills/vendor — Get all bills generated by the authenticated vendor
router.get('/vendor', authenticate, async (req, res, next) => {
    try {
        const { id: vendorId, role } = req.user;

        if (role !== 'vendor') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT b.*, 
                    u.company_name as vendor_name, u.full_name as vendor_full_name,
                    p.title as project_name
             FROM bills b
             JOIN users u ON b.vendor_id = u.id
             LEFT JOIN projects p ON b.project_id = p.id
             WHERE b.vendor_id = $1
             ORDER BY b.created_at DESC`,
            [vendorId]
        );

        res.json({ bills: result.rows });
    } catch (error) {
        next(error);
    }
});

// ==========================================
// CUSTOMER ROUTES
// ==========================================

// GET /api/bills/customer — Get all bills for the authenticated customer's projects
router.get('/customer', authenticate, async (req, res, next) => {
    try {
        const { id: customerId, role } = req.user;

        if (role !== 'customer') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT b.*, 
                    u.company_name as vendor_name, u.full_name as vendor_full_name, u.email as vendor_email,
                    p.title as project_name, p.location as project_location
             FROM bills b
             JOIN users u ON b.vendor_id = u.id
             LEFT JOIN projects p ON b.project_id = p.id
             WHERE b.project_id IN (
                 SELECT id FROM projects WHERE customer_id = $1
             )
             ORDER BY b.created_at DESC`,
            [customerId]
        );

        res.json({ bills: result.rows });
    } catch (error) {
        next(error);
    }
});

// GET /api/bills — Get all bills (management view)
router.get('/', authenticate, async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== 'management') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const result = await query(
            `SELECT b.*, 
                    u.company_name as vendor_name, u.full_name as vendor_full_name,
                    p.title as project_name
             FROM bills b
             JOIN users u ON b.vendor_id = u.id
             LEFT JOIN projects p ON b.project_id = p.id
             ORDER BY b.created_at DESC`
        );

        res.json({ bills: result.rows });
    } catch (error) {
        next(error);
    }
});

// GET /api/bills/:id — Get single bill by ID
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        const result = await query(
            `SELECT b.*, 
                    u.company_name as vendor_name, u.full_name as vendor_full_name, u.email as vendor_email,
                    p.title as project_name, p.location as project_location
             FROM bills b
             JOIN users u ON b.vendor_id = u.id
             LEFT JOIN projects p ON b.project_id = p.id
             WHERE b.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bill not found.' });
        }

        const bill = result.rows[0];

        // Authorization check
        if (role === 'vendor' && bill.vendor_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized.' });
        }

        res.json({ bill });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
