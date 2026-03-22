require('dotenv').config();
const { query } = require('./config/database');

async function fixRoleConstraint() {
    try {
        // Drop the old constraint and recreate it with all 4 roles
        await query(`
            ALTER TABLE users 
            DROP CONSTRAINT IF EXISTS users_role_check;
        `);
        console.log('✅ Old constraint dropped');

        await query(`
            ALTER TABLE users 
            ADD CONSTRAINT users_role_check 
            CHECK (role IN ('customer', 'contractor', 'management', 'vendor'));
        `);
        console.log('✅ New constraint added — vendor role is now allowed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Fix failed:', err.message);
        process.exit(1);
    }
}

fixRoleConstraint();
