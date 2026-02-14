import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 7777,
    database: process.env.DB_NAME || 'scaffoldz',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
});

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log(`Host: ${process.env.DB_HOST}`);
        console.log(`Port: ${process.env.DB_PORT}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`User: ${process.env.DB_USER}`);

        const result = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful!');
        console.log('Current time from database:', result.rows[0].now);

        // Check if tables exist
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('users', 'projects', 'issues', 'feedback', 'otp_store')
        `);

        console.log(`\n✅ Found ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
