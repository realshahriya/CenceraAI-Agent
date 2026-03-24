const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'cencera_dev',
    user: process.env.POSTGRES_USER || 'cencera',
    password: process.env.POSTGRES_PASSWORD || 'dev_password_change_in_prod',
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    // Split on empty lines to execute statements individually if needed, 
    // or just run it as one large script.
    console.log('Applying schema migrations...');
    await client.query(schemaSql);
    
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
