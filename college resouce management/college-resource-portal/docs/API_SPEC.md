# College Resource Digital Portal — API Specification

Base URL: `/api`

All responses follow the structure:
```json
{ "success": true,  "data": { … } }
{ "success": false, "message": "Human-readable error", "errors": [] }
```

Authentication header: `Authorization: Bearer <JWT>`

---

## Auth

| Method | Endpoint              | Auth | Role | Description               |
|--------|-----------------------|------|------|---------------------------|
| POST   | /auth/register        | No   | —    | Register student/faculty  |
| POST   | /auth/login           | No   | —    | Login, returns JWT + user |
| POST   | /auth/logout          | Yes  | Any  | Logout (client drops token)|
| GET    | /auth/me              | Yes  | Any  | Get current user profile  |
| PUT    | /auth/me              | Yes  | Any  | Update profile            |
| PUT    | /auth/me/password     | Yes  | Any  | Change password           |

---

## Departments

| Method | Endpoint               | Auth | Role  | Description             |
|--------|------------------------|------|-------|-------------------------|
| GET    | /departments           | No   | —     | List all departments    |
| GET    | /departments/:id       | No   | —     | Get department by ID    |
| POST   | /departments           | Yes  | Admin | Create department       |
| PUT    | /departments/:id       | Yes  | Admin | Update department       |
| DELETE | /departments/:id       | Yes  | Admin | Delete department       |

---

## Subjects

| Method | Endpoint               | Auth | Role  | Description                        |
|--------|------------------------|------|-------|------------------------------------|
| GET    | /subjects              | No   | —     | List subjects (filter by dept/sem) |
| GET    | /subjects/:id          | No   | —     | Get subject by ID                  |
| POST   | /subjects              | Yes  | Admin | Create subject                     |
| PUT    | /subjects/:id          | Yes  | Admin | Update subject                     |
| DELETE | /subjects/:id          | Yes  | Admin | Delete subject                     |

---

## Resources

| Method | Endpoint                    | Auth | Role              | Description                          |
|--------|-----------------------------|------|-------------------|--------------------------------------|
| GET    | /resources                  | Yes  | Any               | Search/filter/paginate resources     |
| GET    | /resources/:id              | Yes  | Any               | Get resource details + increment view|
| POST   | /resources                  | Yes  | Faculty/Admin     | Upload new resource (multipart)      |
| PUT    | /resources/:id              | Yes  | Faculty/Admin     | Update resource metadata             |
| DELETE | /resources/:id              | Yes  | Faculty/Admin/Admin| Delete resource                      |
| GET    | /resources/:id/download     | Yes  | Student/Faculty/Admin | Download file, increment counter|

Query params for GET /resources:
- `search` — full-text search
- `department` — department UUID
- `semester` — integer
- `subject` — subject UUID
- `type` — resource_type enum value
- `status` — pending/approved/rejected (faculty/admin only)
- `sort` — newest|oldest|downloads|views|title
- `page` — integer (default 1)
- `limit` — integer (default 20, max 100)

---

## Bookmarks

| Method | Endpoint                    | Auth | Role    | Description           |
|--------|-----------------------------|------|---------|-----------------------|
| GET    | /bookmarks                  | Yes  | Student | List my bookmarks     |
| POST   | /bookmarks/:resourceId      | Yes  | Student | Add bookmark          |
| DELETE | /bookmarks/:resourceId      | Yes  | Student | Remove bookmark       |

---

## Downloads

| Method | Endpoint        | Auth | Role    | Description             |
|--------|-----------------|------|---------|-------------------------|
| GET    | /downloads      | Yes  | Student | List my download history|

---

## Announcements

| Method | Endpoint                | Auth | Role              | Description                  |
|--------|-------------------------|------|-------------------|------------------------------|
| GET    | /announcements          | Yes  | Any               | List active announcements    |
| GET    | /announcements/:id      | Yes  | Any               | Get single announcement      |
| POST   | /announcements          | Yes  | Faculty/Admin     | Create announcement          |
| PUT    | /announcements/:id      | Yes  | Faculty/Admin     | Update announcement          |
| DELETE | /announcements/:id      | Yes  | Admin             | Delete announcement          |

---

## Events

| Method | Endpoint          | Auth | Role          | Description           |
|--------|-------------------|------|---------------|-----------------------|
| GET    | /events           | Yes  | Any           | List events (upcoming/past) |
| GET    | /events/:id       | Yes  | Any           | Get event details     |
| POST   | /events           | Yes  | Admin         | Create event          |
| PUT    | /events/:id       | Yes  | Admin         | Update event          |
| DELETE | /events/:id       | Yes  | Admin         | Delete event          |

---

## Notifications

| Method | Endpoint                          | Auth | Role | Description              |
|--------|-----------------------------------|------|------|--------------------------|
| GET    | /notifications                    | Yes  | Any  | List my notifications    |
| PUT    | /notifications/:id/read           | Yes  | Any  | Mark notification read   |
| PUT    | /notifications/read-all           | Yes  | Any  | Mark all as read         |

---

## Admin

| Method | Endpoint                               | Auth | Role  | Description                        |
|--------|----------------------------------------|------|-------|------------------------------------|
| GET    | /admin/users                           | Yes  | Admin | List all users (search/filter/page)|
| GET    | /admin/users/:id                       | Yes  | Admin | Get user detail                    |
| PUT    | /admin/users/:id                       | Yes  | Admin | Update user (role, active status)  |
| DELETE | /admin/users/:id                       | Yes  | Admin | Delete user                        |
| GET    | /admin/resources                       | Yes  | Admin | All resources with status filter   |
| PUT    | /admin/resources/:id/approve           | Yes  | Admin | Approve resource                   |
| PUT    | /admin/resources/:id/reject            | Yes  | Admin | Reject resource with reason        |
| DELETE | /admin/resources/:id                   | Yes  | Admin | Remove resource                    |
| GET    | /admin/analytics                       | Yes  | Admin | Full analytics snapshot            |
| GET    | /admin/analytics/monthly               | Yes  | Admin | Monthly upload/download counts     |
| POST   | /admin/notifications/broadcast         | Yes  | Admin | Send notification to all/role      |

---

## HTTP Status Code Usage

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK                         |
| 201  | Created                    |
| 204  | No Content (delete)        |
| 400  | Bad Request / Validation   |
| 401  | Unauthorised (no/bad token)|
| 403  | Forbidden (wrong role)     |
| 404  | Not Found                  |
| 409  | Conflict (duplicate)       |
| 413  | Payload Too Large          |
| 500  | Internal Server Error      |
