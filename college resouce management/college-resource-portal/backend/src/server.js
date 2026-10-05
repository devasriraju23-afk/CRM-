import 'dotenv/config';
import app from './app.js';
import { config } from './config/env.js';
import { testConnection } from './config/database.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Verify DB connection before accepting requests
  const dbOk = await testConnection();
  if (!dbOk) {
    logger.error('Cannot start server: database connection failed.');
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    logger.info(`🚀 Server running on http://localhost:${config.port} [${config.env}]`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully…`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

startServer();
