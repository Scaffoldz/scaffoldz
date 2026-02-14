import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'scaffoldz',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

// Helper function to execute queries
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Helper function to get a client from the pool for transactions
export const getClient = async () => {
    const client = await pool.connect();
    return client;
};

// Initialize database tables
export const initializeDatabase = async () => {
    try {
        console.log('🔧 Initializing database tables...');

        // Check if tables exist
        const result = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'projects', 'issues', 'feedback', 'otp_store')
        `);

        if (result.rows.length === 5) {
            console.log('✅ All database tables already exist');
        } else {
            console.log('⚠️  Some tables are missing. Please run the schema.sql file manually.');
            console.log('   You can run: psql -U pgadmin -d scaffoldz -f server/database/schema.sql');
        }
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        throw error;
    }
};

// Cleanup old OTPs (run periodically)
export const cleanupExpiredOTPs = async () => {
    try {
        await query('DELETE FROM otp_store WHERE expires_at < NOW()');
    } catch (error) {
        console.error('Error cleaning up OTPs:', error);
    }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

export default pool;
