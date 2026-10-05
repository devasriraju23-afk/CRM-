/**
 * Seed runner — imports seed data into the database.
 * Run: node src/config/seed.js
 */
import 'dotenv/config';
import { pool } from './database.js';
import { logger } from '../utils/logger.js';

// Import seed functions
import { seedAll } from '../../../database/seed/index.js';

const run = async () => {
  const client = await pool.connect();
  try {
    await seedAll(client);
    logger.info('Database seeded successfully.');
  } catch (err) {
    logger.error('Seed failed:', err.message, err.stack);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
