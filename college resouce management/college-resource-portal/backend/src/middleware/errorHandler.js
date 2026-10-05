import { logger } from '../utils/logger.js';

/**
 * Centralised Express error handler.
 * Must be registered LAST (after all routes).
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || 'Internal Server Error';

  // Postgres errors
  if (err.code === '23505') {
    statusCode = 409;
    message    = 'A record with this value already exists.';
  }
  if (err.code === '23503') {
    statusCode = 400;
    message    = 'Referenced record does not exist.';
  }
  if (err.code === '22P02') {
    statusCode = 400;
    message    = 'Invalid UUID format.';
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message    = `File too large. Maximum size allowed is ${process.env.MAX_FILE_SIZE_MB || 50} MB.`;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${message}`, {
      stack: err.stack,
      body:  req.body,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/** Helper to create a typed error with a status code. */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
