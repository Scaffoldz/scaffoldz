import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 7777,
    database: process.env.DB_NAME || 'Scaffoldz',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
});

async function checkUsers() {
    try {
        console.log('Checking users in database...\n');

        const result = await pool.query('SELECT id, email, role, verified, created_at FROM users ORDER BY created_at DESC');

        if (result.rows.length === 0) {
            console.log('❌ No users found in database');
        } else {
            console.log(`✅ Found ${result.rows.length} user(s) in database:\n`);
            result.rows.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Verified: ${user.verified}`);
                console.log(`   Created: ${user.created_at}`);
                console.log('');
            });
        }

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
