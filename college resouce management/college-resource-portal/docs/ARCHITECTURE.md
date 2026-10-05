# College Resource Digital Portal — System Architecture

## 1. Overview

A three-tier, modular web application that centralises academic resources for students, faculty, and administrators in a single secure platform.

```
Browser (React + Vite)
        │
        ▼
  REST API Layer  (Express.js on Node.js)
        │
        ▼
  Service / Business Logic Layer
        │
        ▼
  Data Access Layer  (pg / node-postgres)
        │
        ▼
  PostgreSQL Database
        │
        ▼
  File Storage  (Supabase Storage / Cloudinary / Local)
```

---

## 2. Technology Choices

| Layer            | Technology                        | Reason                                         |
|------------------|-----------------------------------|------------------------------------------------|
| Frontend         | React 18 + Vite + Tailwind CSS    | Fast HMR, utility-first styling, wide ecosystem|
| Routing          | React Router v6                   | Declarative nested routing                     |
| HTTP Client      | Axios                             | Interceptors for JWT injection & error handling|
| Icons            | Lucide React                      | Consistent, tree-shakable icon set             |
| Backend          | Node.js + Express.js              | Non-blocking I/O, huge npm ecosystem           |
| Auth             | JWT (jsonwebtoken) + bcrypt       | Stateless auth, industry standard              |
| File Uploads     | Multer                            | Memory/disk/cloud streaming support            |
| Database         | PostgreSQL 15                     | ACID, full-text search, JSON support           |
| DB Driver        | node-postgres (pg)                | Battle-tested, connection pooling              |
| Validation       | express-validator                 | Declarative, chainable validators              |
| Logging          | Morgan + custom logger            | HTTP logging + structured app logs             |
| Rate Limiting    | express-rate-limit                | Brute-force protection                         |

---

## 3. Module Breakdown

### Frontend Modules
```
public/                    Static assets
src/
  assets/                  Images, logos
  components/              Reusable UI components
    common/                Button, Input, Modal, Toast, Badge, Spinner …
    layout/                AppLayout, Sidebar, TopNav, UserMenu
    resource/              ResourceCard, ResourceTable, UploadForm …
    dashboard/             StatCard, ChartWidget, ActivityFeed …
  pages/
    public/                Landing, Login, Register, About
    student/               Dashboard, Library, ResourceDetail, Bookmarks …
    faculty/               Dashboard, Upload, MyResources, Analytics …
    admin/                 Dashboard, Users, Departments, Approvals …
  layouts/                 PublicLayout, DashboardLayout
  hooks/                   useAuth, useResources, useDebounce, useToast
  services/                api.js (axios instance), authService, resourceService …
  context/                 AuthContext, NotificationContext
  utils/                   formatters, validators, constants
  router/                  index.jsx (all routes + guards)
```

### Backend Modules
```
src/
  server.js                Entry point
  app.js                   Express app setup, middleware registration
  config/
    database.js            pg pool configuration
    storage.js             File storage configuration
    env.js                 Environment variable validation
  routes/
    auth.routes.js
    resource.routes.js
    bookmark.routes.js
    download.routes.js
    announcement.routes.js
    event.routes.js
    notification.routes.js
    admin.routes.js
    department.routes.js
    subject.routes.js
  controllers/             One controller per route file
  services/                Business logic, called from controllers
  middleware/
    auth.middleware.js      authenticateUser, authorizeRole
    upload.middleware.js    Multer configuration
    errorHandler.js         Centralised error handling
    rateLimiter.js
    requestLogger.js
  validators/              express-validator rule sets
  utils/
    logger.js
    response.js            Standardised JSON response helpers
    fileHelpers.js
  models/                  Query functions (no ORM; raw SQL via pg)
```

---

## 4. Authentication & Authorisation Flow

```
POST /api/auth/login
  → validate credentials
  → bcrypt.compare(password, hash)
  → sign JWT  { userId, role, email }  exp: 7d
  → return { token, user }

Protected Request:
  Authorization: Bearer <token>
  → authenticateUser middleware decodes token
  → req.user = { id, role, email }
  → authorizeRole('admin') | authorizeRole('faculty', 'admin')
```

---

## 5. File Upload Flow

```
Faculty uploads file
  → Multer validates MIME type + size
  → File streamed to storage provider
  → Storage returns file URL + key
  → URL saved to resources table
  → Resource status = 'pending'
  → Admin notified

Admin approves
  → resources.status = 'approved'
  → Notification sent to uploader
  → Resource visible to students
```

---

## 6. Search Architecture

```
GET /api/resources?search=DSP&department=CSE&semester=5&type=notes&sort=downloads

Backend:
  → Build dynamic SQL with parameterised WHERE clauses
  → Full-text search on title + description using PostgreSQL tsvector
  → Apply filters: department, semester, subject, type, status
  → Apply sorting: created_at, download_count, view_count, title
  → Return paginated results { data, total, page, limit }

Frontend:
  → useDebounce(searchTerm, 400) before firing request
  → URL query params kept in sync with filter state
```

---

## 7. Notification Architecture

Notifications are generated server-side at key lifecycle events and stored in the `notifications` table. The frontend polls `/api/notifications?unread=true` on mount and at 60-second intervals. Future enhancement: replace polling with WebSocket (Socket.io).

---

## 8. Security Layers

1. **Transport**: HTTPS in production; CORS restricted to frontend origin.
2. **Authentication**: JWT with expiry; tokens never stored in plain localStorage without HttpOnly cookie option for production.
3. **Authorisation**: Role middleware on every protected route.
4. **Input**: express-validator on all mutation endpoints.
5. **File**: MIME type whitelist; 50 MB size limit; no executable extensions.
6. **Database**: Parameterised queries throughout; no string interpolation.
7. **Rate Limiting**: 100 req/15 min on auth endpoints, 300 req/15 min general.
8. **Secrets**: All credentials in `.env`; `.env` in `.gitignore`.

---

## 9. Scalability Considerations

- Stateless API → horizontal scaling behind a load balancer.
- Database connection pooling (pg pool max: 20).
- File storage is external (S3/Cloudinary) → CDN delivery.
- Analytics queries use pre-aggregated counters (`download_count`, `view_count`) to avoid expensive COUNT queries.
- Indexes on all foreign keys and common filter columns.
- Full-text search index (`tsvector`) on resources table.
