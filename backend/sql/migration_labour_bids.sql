-- Migration: Add labour_workers table and update bids status constraint

-- 1. Update bids status constraint
ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_status_check;
ALTER TABLE bids ADD CONSTRAINT bids_status_check CHECK (status IN ('Pending', 'Selected', 'Rejected', 'Quotation Lost'));

-- 2. Create labour_workers table
CREATE TABLE IF NOT EXISTS labour_workers (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    daily_wage DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'In-active')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_labour_project ON labour_workers(project_id);
CREATE INDEX IF NOT EXISTS idx_labour_contractor ON labour_workers(contractor_id);
