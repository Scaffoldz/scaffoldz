-- Step 1: Create the database (run this first)
-- Open pgAdmin or psql and run:

CREATE DATABASE scaffoldz
    WITH 
    OWNER = pgadmin
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

-- Step 2: Connect to the scaffoldz database
-- In pgAdmin: Right-click on "scaffoldz" database and select "Query Tool"
-- In psql: Run: \c scaffoldz

-- Step 3: Then run the schema.sql file
-- The schema.sql file contains all table definitions
