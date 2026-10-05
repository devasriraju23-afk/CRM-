import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes         from './routes/auth.routes.js';
import departmentRoutes   from './routes/department.routes.js';
import subjectRoutes      from './routes/subject.routes.js';
import resourceRoutes     from './routes/resource.routes.js';
import bookmarkRoutes     from './routes/bookmark.routes.js';
import downloadRoutes     from './routes/download.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import eventRoutes        from './routes/event.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes        from './routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── Security & parsing ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow file serving
}));
app.use(cors({
  origin:      config.cors.origin,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──────────────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', generalLimiter);

// ── Static file serving (local storage) ─────────────────────────────────────
app.use(
  '/api/files',
  express.static(path.resolve(config.storage.localDir), { maxAge: '1d' })
);

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/departments',   departmentRoutes);
app.use('/api/subjects',      subjectRoutes);
app.use('/api/resources',     resourceRoutes);
app.use('/api/bookmarks',     bookmarkRoutes);
app.use('/api/downloads',     downloadRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ── Centralised error handler ─────────────────────────────────────────────────
app.use(errorHandler);

export default app;
