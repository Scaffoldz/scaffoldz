const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { query } = require('./config/database');

const runMigration = async () => {
    try {
        const sqlPath = path.join(__dirname, 'sql', 'migration_labour_bids.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('⏳ Running migration...');
        await query(sql);
        console.log('✅ Migration successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
