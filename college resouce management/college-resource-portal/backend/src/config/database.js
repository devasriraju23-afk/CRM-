import pg from 'pg';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.db.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
});

/**
 * Execute a parameterised query.
 * @param {string} text  SQL string with $1, $2 … placeholders
 * @param {Array}  params  Parameter values
 */
export const query = async (text, params = []) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.env === 'development') {
    logger.debug(`Query executed in ${duration}ms — rows: ${result.rowCount}`);
  }
  return result;
};

/** Obtain a client for multi-statement transactions. */
export const getClient = () => pool.connect();

export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    logger.info(`Database connected — server time: ${result.rows[0].now}`);
    return true;
  } catch (err) {
    logger.error('Database connection failed:', err.message);
    return false;
  }
};
