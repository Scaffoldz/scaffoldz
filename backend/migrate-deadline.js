const { query } = require('./config/database');

async function migrate() {
    try {
        console.log('Starting migration: Adding bidding_deadline to projects table...');
        await query('ALTER TABLE projects ADD COLUMN IF NOT EXISTS bidding_deadline TIMESTAMP;');
        console.log('✅ Migration successful: bidding_deadline column added.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
