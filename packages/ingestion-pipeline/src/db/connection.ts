import { Pool } from 'pg';

export const db = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'cencera_dev',
  user: process.env.POSTGRES_USER || 'cencera',
  password: process.env.POSTGRES_PASSWORD || 'dev_password_change_in_prod',
});
