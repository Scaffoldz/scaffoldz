import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getClient, initializeDatabase } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, .jpeg, and .pdf files are allowed!'));
        }
    }
});

// Email transporter configuration - only create if credentials are provided
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('✅ Email transporter configured successfully');
    } catch (error) {
        console.error('❌ Error creating email transporter:', error.message);
        transporter = null; // Ensure it stays null on error
    }
}

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTPEmail(email, otp, purpose = 'verification') {
    // ALWAYS log OTP to console as backup
    console.log('\n========================================');
    console.log('🔐 OTP GENERATED');
    console.log('========================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 OTP: ${otp}`);
    console.log(`📝 Purpose: ${purpose}`);
    console.log('========================================\n');

    // If no email configuration, just return true (OTP already logged above)
    if (!transporter) {
        console.log('⚠️  Email not configured - OTP shown above for testing\n');
        return true;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your OTP for ${purpose}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Your OTP code is:</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully to', email);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.log('⚠️  Email failed - but OTP is shown above in console\n');
        return true; // Still return true since OTP is logged to console
    }
}

// Store OTP with expiration in database
async function storeOTP(email, otp, purpose = 'login') {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await query(
        'INSERT INTO otp_store (email, otp, purpose, expires_at) VALUES ($1, $2, $3, $4)',
        [email, otp, purpose, expiresAt]
    );
}

// Verify OTP from database
async function verifyOTP(email, otp) {
    const result = await query(
        'SELECT * FROM otp_store WHERE email = $1 AND otp = $2 AND expires_at > NOW()',
        [email, otp]
    );

    if (result.rows.length === 0) {
        return { valid: false, message: 'Invalid or expired OTP' };
    }

    // Delete used OTP
    await query('DELETE FROM otp_store WHERE email = $1 AND otp = $2', [email, otp]);

    return { valid: true };
}

// Routes

// Sign up - Step 1: Register user and send OTP
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validation
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!['customer', 'management', 'contractor'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        // Check if user already exists
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP and send email
        const otp = generateOTP();
        const emailSent = await sendOTPEmail(email, otp, 'signup verification');

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP. Please check email configuration.' });
        }

        // Store OTP
        await storeOTP(email, otp, 'signup');

        // Hash password (we'll retrieve this during verification by re-prompting or using session)
        // For now, let's store the hashed password and role in a map or simpler approach
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store a marker that signup is pending - we'll need user to provide password hash again
        // Better solution: use a separate table or extend otp_store schema
        // For now: Store minimal data by using purpose field as identifier
        global.pendingSignups = global.pendingSignups || {};
        global.pendingSignups[email] = { password: hashedPassword, role, expires: Date.now() + 30 * 60 * 1000 };

        res.json({ message: 'OTP sent to your email', email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sign up - Step 2: Verify OTP and complete registration
app.post('/api/verify-signup-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Verify OTP
        const verification = await verifyOTP(email, otp);
        if (!verification.valid) {
            return res.status(400).json({ message: verification.message });
        }

        // Get pending user data from global storage
        global.pendingSignups = global.pendingSignups || {};
        const userData = global.pendingSignups[email];

        if (!userData) {
            return res.status(400).json({ message: 'Registration data not found or expired' });
        }

        // Check if data has expired
        if (Date.now() > userData.expires) {
            delete global.pendingSignups[email];
            return res.status(400).json({ message: 'Registration session expired. Please sign up again.' });
        }

        // Create user account
        await query(
            'INSERT INTO users (email, password, role, verified) VALUES ($1, $2, $3, $4)',
            [email, userData.password, userData.role, true]
        );

        // Clean up pending data
        delete global.pendingSignups[email];

        res.json({
            message: 'Account created successfully',
            user: {
                email: email,
                role: userData.role,
            },
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login - Step 1: Verify credentials and send OTP
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate and send OTP
        const otp = generateOTP();
        const emailSent = await sendOTPEmail(email, otp, 'login verification');

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP. Please check email configuration.' });
        }

        await storeOTP(email, otp, 'login');

        res.json({ message: 'OTP sent to your email', email });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login - Step 2: Verify OTP and complete login
app.post('/api/verify-login-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Verify OTP
        const verification = await verifyOTP(email, otp);
        if (!verification.valid) {
            return res.status(400).json({ message: verification.message });
        }

        // Get user data
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        res.json({
            message: 'Login successful',
            user: {
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login OTP verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Resend OTP
app.post('/api/resend-otp', async (req, res) => {
    try {
        const { email, type } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const purpose = type === 'signup' ? 'signup verification' : 'login verification';
        const emailSent = await sendOTPEmail(email, otp, purpose);

        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        await storeOTP(email, otp, type || 'login');

        res.json({ message: 'New OTP sent to your email' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ========================================
// PROJECT MANAGEMENT ENDPOINTS
// ========================================

// Create new project
app.post('/api/projects', upload.single('blueprint'), async (req, res) => {
    try {
        const { title, address, projectType, timeline, budget, customerEmail } = req.body;

        if (!title || !address || !projectType || !timeline || !budget || !customerEmail) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get the next project ID
        const countResult = await query('SELECT COUNT(*) FROM projects');
        const projectCount = parseInt(countResult.rows[0].count) + 1;
        const projectId = `PROJECT-${String(projectCount).padStart(5, '0')}`;

        // Calculate expected completion date (simple: add 6 months from now)
        const expectedCompletion = new Date();
        expectedCompletion.setMonth(expectedCompletion.getMonth() + 6);

        const blueprintPath = req.file ? req.file.path : null;

        await query(
            `INSERT INTO projects (id, title, address, project_type, timeline, budget, customer_email, 
             status, progress, blueprint_path, expected_completion) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [projectId, title, address, projectType, timeline, parseFloat(budget), customerEmail,
                'Submitted', 0, blueprintPath, expectedCompletion]
        );

        const result = await query('SELECT * FROM projects WHERE id = $1', [projectId]);

        res.json({
            message: 'Project created successfully',
            project: result.rows[0]
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all projects for a customer
app.get('/api/projects', async (req, res) => {
    try {
        const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
        const projectsArray = result.rows;

        res.json({
            projects: projectsArray,
            summary: {
                total: projectsArray.length,
                active: projectsArray.filter(p => p.status === 'Under Construction').length,
                completed: projectsArray.filter(p => p.status === 'Completed').length,
                pending: projectsArray.filter(p => p.status === 'Submitted' || p.status === 'Under Review').length
            }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single project details
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('SELECT * FROM projects WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = result.rows[0];

        // Add mock data for demonstration (in real app, this would come from other tables)
        const enrichedProject = {
            ...project,
            stages: [
                { name: 'Foundation', status: 'completed', progress: 100, expectedDate: '2026-01-15', actualDate: '2026-01-14' },
                { name: 'Structure', status: 'completed', progress: 100, expectedDate: '2026-02-10', actualDate: '2026-02-12' },
                { name: 'Walls', status: 'in-progress', progress: 65, expectedDate: '2026-03-01', actualDate: null },
                { name: 'Roof', status: 'pending', progress: 0, expectedDate: '2026-03-20', actualDate: null },
                { name: 'Finishing', status: 'pending', progress: 0, expectedDate: '2026-04-15', actualDate: null }
            ],
            budgetBreakdown: {
                estimated: parseFloat(project.budget),
                spent: Math.floor(parseFloat(project.budget) * 0.45),
                categories: [
                    { name: 'Labour', estimated: parseFloat(project.budget) * 0.4, spent: parseFloat(project.budget) * 0.35 },
                    { name: 'Materials', estimated: parseFloat(project.budget) * 0.45, spent: parseFloat(project.budget) * 0.40 },
                    { name: 'Equipment', estimated: parseFloat(project.budget) * 0.15, spent: parseFloat(project.budget) * 0.10 }
                ]
            },
            resources: {
                labour: { total: 45, active: 32 },
                materials: [
                    { name: 'Cement (bags)', quantity: 500, unit: 'bags' },
                    { name: 'Steel (tons)', quantity: 12, unit: 'tons' },
                    { name: 'Bricks', quantity: 50000, unit: 'pieces' },
                    { name: 'Sand (cubic meters)', quantity: 150, unit: 'm³' }
                ]
            },
            dailyReports: [
                {
                    id: 1,
                    date: '2026-02-13',
                    description: 'Wall construction progressing well. Completed north and east sides.',
                    areaCovered: '250 sq ft',
                    materialsUsed: 'Bricks: 5000, Cement: 50 bags',
                    photos: ['📸', '📸', '📸']
                },
                {
                    id: 2,
                    date: '2026-02-12',
                    description: 'Started wall construction on the north side. Weather conditions good.',
                    areaCovered: '180 sq ft',
                    materialsUsed: 'Bricks: 3500, Cement: 35 bags',
                    photos: ['📸', '📸']
                }
            ]
        };

        res.json({ project: enrichedProject });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Raise an issue for a project
app.post('/api/projects/:id/issues', async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, description, priority } = req.body;

        if (!subject || !description || !priority) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if project exists
        const projectResult = await query('SELECT * FROM projects WHERE id = $1', [id]);
        if (projectResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Get the next issue ID
        const countResult = await query('SELECT COUNT(*) FROM issues');
        const issueCount = parseInt(countResult.rows[0].count) + 1;
        const issueId = `ISSUE-${String(issueCount).padStart(5, '0')}`;

        await query(
            'INSERT INTO issues (id, project_id, subject, description, priority, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [issueId, id, subject, description, priority, 'Open']
        );

        const result = await query('SELECT * FROM issues WHERE id = $1', [issueId]);

        res.json({
            message: 'Issue raised successfully',
            issue: result.rows[0]
        });
    } catch (error) {
        console.error('Raise issue error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit feedback for a completed project
app.post('/api/projects/:id/feedback', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        if (rating === undefined) {
            return res.status(400).json({ message: 'Rating is required' });
        }

        // Check if project exists
        const projectResult = await query('SELECT * FROM projects WHERE id = $1', [id]);
        if (projectResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if feedback already exists
        const existingFeedback = await query('SELECT * FROM feedback WHERE project_id = $1', [id]);
        if (existingFeedback.rows.length > 0) {
            // Update existing feedback
            await query(
                'UPDATE feedback SET rating = $1, comment = $2, submitted_at = NOW() WHERE project_id = $3',
                [parseInt(rating), comment || '', id]
            );
        } else {
            // Insert new feedback
            await query(
                'INSERT INTO feedback (project_id, rating, comment) VALUES ($1, $2, $3)',
                [id, parseInt(rating), comment || '']
            );
        }

        const result = await query('SELECT * FROM feedback WHERE project_id = $1', [id]);

        res.json({
            message: 'Feedback submitted successfully',
            feedback: result.rows[0]
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Initialize database and start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log('\n📧 Email configuration:', {
                host: process.env.EMAIL_HOST,
                user: process.env.EMAIL_USER,
                configured: !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS),
            });

            if (!transporter) {
                console.log('\n⚠️  WARNING: Email is NOT configured!');
                console.log('OTPs will be displayed in the console instead.');
                console.log('To enable email delivery, configure the .env file.\n');
            }

            console.log('\n💾 Database: PostgreSQL');
            console.log(`   Database name: ${process.env.DB_NAME}`);
            console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('\n📋 To set up the database:');
        console.error('   1. Open pgAdmin');
        console.error('   2. Run server/database/create_database.sql to create the database');
        console.error('   3. Run server/database/schema.sql to create the tables');
        console.error('   4. Restart this server\n');
        process.exit(1);
    }
}

startServer();
