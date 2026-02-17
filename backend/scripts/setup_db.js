const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createDatabase = async () => {
    console.log('🔄 Attempting to create database automatically...');

    // Configuration for connecting to default 'postgres' database
    const config = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres', // Connect to default database
    };

    const client = new Client(config);

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL server');

        // Check if database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);

        if (res.rows.length === 0) {
            console.log(`Creating database '${process.env.DB_NAME}'...`);
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log('✅ Database created successfully');
        } else {
            console.log(`ℹ️  Database '${process.env.DB_NAME}' already exists`);
        }

        await client.end();

        // Now connect to the new database to run schema
        console.log('🔄 Running schema migrations...');
        const dbClient = new Client({
            ...config,
            database: process.env.DB_NAME
        });

        await dbClient.connect();

        // Read schema file
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Run schema
        await dbClient.query(schemaSql);
        console.log('✅ Schema applied successfully');

        await dbClient.end();
        console.log('🎉 Database setup complete!');
        return true;

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        if (client) await client.end();
        return false;
    }
};

createDatabase();
