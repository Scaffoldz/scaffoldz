require('dotenv').config();
const { pool } = require('./config/database');

async function fixBidsConstraint() {
    try {
        console.log('Connecting to database to fix bids status check constraint...');
        
        // Drop old constraint
        await pool.query('ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_status_check');
        console.log('Dropped existing constraint.');
        
        // Add new constraint
        await pool.query("ALTER TABLE bids ADD CONSTRAINT bids_status_check CHECK (status IN ('Pending', 'Selected', 'Rejected', 'Quotation Lost'))");
        console.log('Added new constraint allowing Quotation Lost.');
        
        console.log('Migration complete.');
    } catch (error) {
        console.error('Error migrating constraint:', error);
    } finally {
        await pool.end();
    }
}

fixBidsConstraint();
