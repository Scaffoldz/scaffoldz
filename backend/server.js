const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const milestoneRoutes = require('./routes/milestones');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const materialRoutes = require('./routes/materials');
const attendanceRoutes = require('./routes/attendance');
const messageRoutes = require('./routes/messages');
const procurementRoutes = require('./routes/procurement');
const labourRoutes = require('./routes/labour');
const billRoutes = require('./routes/bills');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`📨 ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Scaffoldz API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/bills', billRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (!dbConnected) {
            console.error('❌ Failed to connect to database. Please check your .env configuration.');
            process.exit(1);
        }

        // Start listening
        app.listen(PORT, () => {
            console.log('🚀 ================================================');
            console.log(`🚀 Scaffoldz Backend API Server`);
            console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Server running on: http://localhost:${PORT}`);
            console.log(`🚀 Health check: http://localhost:${PORT}/health`);
            console.log('🚀 ================================================');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
