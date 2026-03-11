-- Migration: Add procurement_suggestions table
-- Run this if your database already exists and you don't want to re-run the full schema.

CREATE TABLE IF NOT EXISTS procurement_suggestions (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    suggestion_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_procurement_suggestions_project ON procurement_suggestions(project_id);
