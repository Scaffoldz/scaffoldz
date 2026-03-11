const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'final',
  user: 'postgres',
  password: 'Grace@22'
});

async function updateDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Updating users table role constraint...');
    // Drop existing constraint if it exists
    await client.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    `);
    
    // Add new constraint with 'vendor'
    await client.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('customer', 'contractor', 'management', 'vendor'));
    `);

    console.log('Creating material_requests table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS material_requests (
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
    `);

    console.log('Creating vendor_quotations table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS vendor_quotations (
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
    `);

    console.log('Creating supply_orders table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS supply_orders (
          id SERIAL PRIMARY KEY,
          quotation_id INTEGER REFERENCES vendor_quotations(id) ON DELETE CASCADE,
          project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          vendor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          contractor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          delivery_status VARCHAR(50) DEFAULT 'Pending' CHECK (delivery_status IN ('Pending', 'In Transit', 'Delivered', 'Cancelled')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating missing indexes...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_material_requests_project ON material_requests(project_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vendor_quotations_request ON vendor_quotations(request_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_supply_orders_vendor ON supply_orders(vendor_id);`);

    console.log('Creating triggers...');
    
    // Ensure the function exists 
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_material_requests_updated_at') THEN
              CREATE TRIGGER update_material_requests_updated_at
              BEFORE UPDATE ON material_requests
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END $$;

      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vendor_quotations_updated_at') THEN
              CREATE TRIGGER update_vendor_quotations_updated_at
              BEFORE UPDATE ON vendor_quotations
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END $$;

      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_supply_orders_updated_at') THEN
              CREATE TRIGGER update_supply_orders_updated_at
              BEFORE UPDATE ON supply_orders
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          END IF;
      END $$;
    `);

    await client.query('COMMIT');
    console.log('Database update complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error updating database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

updateDb();
