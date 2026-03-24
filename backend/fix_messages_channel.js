require('dotenv').config();
const { pool } = require('./config/database');

async function fixMessagesChannel() {
    try {
        console.log('Connecting to database to add channel column to messages table...');
        
        // Add channel column
        await pool.query('ALTER TABLE messages ADD COLUMN IF NOT EXISTS channel VARCHAR(50)');
        console.log('Added channel column to messages table.');
        
        // Update existing messages with a default value so queries don't break if they expect one
        await pool.query("UPDATE messages SET channel = 'customer_management' WHERE channel IS NULL");
        console.log('Updated existing messages to have default channel customer_management.');

        console.log('Migration complete.');
    } catch (error) {
        console.error('Error migrating messages table:', error);
    } finally {
        await pool.end();
    }
}

fixMessagesChannel();
