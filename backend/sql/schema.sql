-- Scaffoldz Construction Management Platform - PostgreSQL Database Schema
-- Database: final

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS internal_notes CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS report_photos CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS otps CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table (Customer, Contractor, Management)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'contractor', 'management', 'vendor')),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    experience_years INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTPs Table (For email verification)
CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    budget DECIMAL(15, 2),
    start_date DATE,
    deadline DATE,
    bidding_deadline TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Bidding', 'Assigned', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
    customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assigned_contractor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids/Quotations Table
CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    duration_months INTEGER,
    proposal TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Selected', 'Rejected')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, contractor_id)
);

-- Milestones Table
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id INTEGER REFERENCES milestones(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Failed')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Reports Table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    submitted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    report_date DATE NOT NULL,
    work_done TEXT NOT NULL,
    labour_count INTEGER,
    materials_used TEXT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Photos Table
CREATE TABLE report_photos (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id) ON DELETE CASCADE,
    photo_url VARCHAR(500) NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials Inventory Table
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2),
    unit VARCHAR(50),
    cost_per_unit DECIMAL(10, 2),
    total_cost DECIMAL(15, 2),
    supplier VARCHAR(255),
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'Ordered' CHECK (status IN ('Ordered', 'Delivered', 'Used')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker Attendance Table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    worker_name VARCHAR(255) NOT NULL,
    worker_type VARCHAR(100),
    attendance_date DATE NOT NULL,
    hours_worked DECIMAL(5, 2),
    wage_per_hour DECIMAL(10, 2),
    total_wage DECIMAL(10, 2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table (Project-based messaging)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internal Notes Table (Management only)
CREATE TABLE internal_notes (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material Quotation Requests Table (Created by Contractor)
CREATE TABLE material_requests (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    contractor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    material_type VARCHAR(255) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    deadline DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Quotations Table (Submitted by Vendor)
CREATE TABLE vendor_quotations (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES material_requests(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    price_per_unit DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    estimated_delivery_time VARCHAR(255) NOT NULL,
    additional_notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supply Orders Table (Approved quotations)
CREATE TABLE supply_orders (
    id SERIAL PRIMARY KEY,
    quotation_id INTEGER REFERENCES vendor_quotations(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    contractor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    delivery_status VARCHAR(50) DEFAULT 'Pending' CHECK (delivery_status IN ('Pending', 'In Transit', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_contractor ON projects(assigned_contractor_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_bids_project ON bids(project_id);
CREATE INDEX idx_bids_contractor ON bids(contractor_id);
CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_messages_project ON messages(project_id);
CREATE INDEX idx_materials_project ON materials(project_id);
CREATE INDEX idx_attendance_project ON attendance(project_id);
CREATE INDEX idx_otps_email ON otps(email);
CREATE INDEX idx_material_requests_project ON material_requests(project_id);
CREATE INDEX idx_vendor_quotations_request ON vendor_quotations(request_id);
CREATE INDEX idx_supply_orders_vendor ON supply_orders(vendor_id);

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_requests_updated_at BEFORE UPDATE ON material_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_quotations_updated_at BEFORE UPDATE ON vendor_quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supply_orders_updated_at BEFORE UPDATE ON supply_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, phone)
VALUES ('admin@scaffoldz.com', '$2a$10$zQX7jJ8qKYJj4tqV3Y3TH.1IGVyJxGBKdxQKYGKYU4XxGKYU4XxGK', 'Admin User', 'management', '9999999999');

-- Insert sample vendor user (password: vendor123)
-- (assuming same password hash for simplicity in dev)
INSERT INTO users (email, password_hash, full_name, role, phone, company_name)
VALUES ('vendor@scaffoldz.com', '$2a$10$zQX7jJ8qKYJj4tqV3Y3TH.1IGVyJxGBKdxQKYGKYU4XxGKYU4XxGK', 'Vendor Supplier', 'vendor', '8888888888', 'Supplier Inc.');

COMMIT;
