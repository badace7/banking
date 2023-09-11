import { Pool } from 'pg';
import { dotenvConfig } from './dot-env';
dotenvConfig('.env');

export const pgPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export const pgProvider = {
  provide: 'PG_POOL',
  useValue: pgPool,
};
