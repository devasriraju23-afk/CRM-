# College Resource Digital Portal — Database Schema

## Entity Relationship Summary

```
users ──< resources ──< resource_tags
  │            │
  │            ├──< bookmarks >── users
  │            └──< downloads >── users
  │
  ├──< announcements
  ├──< events
  ├──< notifications
  └──< activity_logs

departments ──< subjects ──< resources
departments ──< users
```

---

## Table Definitions

### users
| Column         | Type                     | Constraints                          |
|----------------|--------------------------|--------------------------------------|
| id             | UUID                     | PK, DEFAULT gen_random_uuid()        |
| email          | VARCHAR(255)             | UNIQUE, NOT NULL                     |
| password_hash  | VARCHAR(255)             | NOT NULL                             |
| role           | ENUM('student','faculty','admin') | NOT NULL               |
| first_name     | VARCHAR(100)             | NOT NULL                             |
| last_name      | VARCHAR(100)             | NOT NULL                             |
| department_id  | UUID                     | FK → departments.id, NULLABLE        |
| semester       | INTEGER                  | 1–8, NULLABLE (students)             |
| roll_number    | VARCHAR(50)              | NULLABLE (students)                  |
| employee_id    | VARCHAR(50)              | NULLABLE (faculty/admin)             |
| avatar_url     | TEXT                     | NULLABLE                             |
| is_active      | BOOLEAN                  | DEFAULT true                         |
| last_login     | TIMESTAMP WITH TIME ZONE | NULLABLE                             |
| created_at     | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                        |
| updated_at     | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                        |

### departments
| Column      | Type         | Constraints                   |
|-------------|--------------|-------------------------------|
| id          | UUID         | PK                            |
| name        | VARCHAR(200) | UNIQUE, NOT NULL              |
| code        | VARCHAR(20)  | UNIQUE, NOT NULL              |
| description | TEXT         | NULLABLE                      |
| hod_name    | VARCHAR(200) | NULLABLE                      |
| is_active   | BOOLEAN      | DEFAULT true                  |
| created_at  | TIMESTAMP    | DEFAULT NOW()                 |
| updated_at  | TIMESTAMP    | DEFAULT NOW()                 |

### subjects
| Column        | Type         | Constraints                        |
|---------------|--------------|------------------------------------|
| id            | UUID         | PK                                 |
| name          | VARCHAR(200) | NOT NULL                           |
| code          | VARCHAR(50)  | UNIQUE, NOT NULL                   |
| department_id | UUID         | FK → departments.id, NOT NULL      |
| semester      | INTEGER      | NOT NULL (1–8)                     |
| credits       | INTEGER      | NULLABLE                           |
| is_active     | BOOLEAN      | DEFAULT true                       |
| created_at    | TIMESTAMP    | DEFAULT NOW()                      |
| updated_at    | TIMESTAMP    | DEFAULT NOW()                      |

### resources
| Column          | Type           | Constraints                           |
|-----------------|----------------|---------------------------------------|
| id              | UUID           | PK                                    |
| title           | VARCHAR(300)   | NOT NULL                              |
| description     | TEXT           | NULLABLE                              |
| resource_type   | ENUM           | notes/question_papers/assignments/lab_manuals/syllabus/ebooks/presentations/study_materials/other |
| category        | VARCHAR(100)   | NULLABLE                              |
| department_id   | UUID           | FK → departments.id, NOT NULL         |
| subject_id      | UUID           | FK → subjects.id, NULLABLE            |
| semester        | INTEGER        | NULLABLE                              |
| file_url        | TEXT           | NOT NULL                              |
| file_key        | TEXT           | NOT NULL (storage provider key)       |
| file_type       | VARCHAR(50)    | NOT NULL (pdf, docx …)                |
| file_size       | BIGINT         | NOT NULL (bytes)                      |
| thumbnail_url   | TEXT           | NULLABLE                              |
| uploaded_by     | UUID           | FK → users.id, NOT NULL               |
| status          | ENUM           | pending/approved/rejected, DEFAULT pending |
| rejection_reason| TEXT           | NULLABLE                              |
| download_count  | INTEGER        | DEFAULT 0                             |
| view_count      | INTEGER        | DEFAULT 0                             |
| search_vector   | TSVECTOR       | Generated column for full-text search |
| created_at      | TIMESTAMP      | DEFAULT NOW()                         |
| updated_at      | TIMESTAMP      | DEFAULT NOW()                         |

### resource_tags
| Column      | Type        | Constraints                         |
|-------------|-------------|-------------------------------------|
| id          | UUID        | PK                                  |
| resource_id | UUID        | FK → resources.id, ON DELETE CASCADE|
| tag         | VARCHAR(50) | NOT NULL                            |
| UNIQUE(resource_id, tag)                                    |

### bookmarks
| Column      | Type      | Constraints                         |
|-------------|-----------|-------------------------------------|
| id          | UUID      | PK                                  |
| user_id     | UUID      | FK → users.id, ON DELETE CASCADE    |
| resource_id | UUID      | FK → resources.id, ON DELETE CASCADE|
| created_at  | TIMESTAMP | DEFAULT NOW()                       |
| UNIQUE(user_id, resource_id)                                |

### downloads
| Column      | Type      | Constraints                         |
|-------------|-----------|-------------------------------------|
| id          | UUID      | PK                                  |
| user_id     | UUID      | FK → users.id, ON DELETE CASCADE    |
| resource_id | UUID      | FK → resources.id, ON DELETE CASCADE|
| downloaded_at| TIMESTAMP| DEFAULT NOW()                       |
| ip_address  | INET      | NULLABLE                            |

### announcements
| Column      | Type           | Constraints                             |
|-------------|----------------|-----------------------------------------|
| id          | UUID           | PK                                      |
| title       | VARCHAR(300)   | NOT NULL                                |
| description | TEXT           | NOT NULL                                |
| department_id| UUID          | FK → departments.id, NULLABLE (null=all)|
| priority    | ENUM           | normal/important/urgent, DEFAULT normal |
| published_at| TIMESTAMP      | DEFAULT NOW()                           |
| expires_at  | TIMESTAMP      | NULLABLE                                |
| created_by  | UUID           | FK → users.id, NOT NULL                 |
| is_active   | BOOLEAN        | DEFAULT true                            |
| created_at  | TIMESTAMP      | DEFAULT NOW()                           |
| updated_at  | TIMESTAMP      | DEFAULT NOW()                           |

### events
| Column            | Type         | Constraints                        |
|-------------------|--------------|------------------------------------|
| id                | UUID         | PK                                 |
| name              | VARCHAR(300) | NOT NULL                           |
| description       | TEXT         | NULLABLE                           |
| event_date        | DATE         | NOT NULL                           |
| event_time        | TIME         | NULLABLE                           |
| venue             | VARCHAR(300) | NULLABLE                           |
| department_id     | UUID         | FK → departments.id, NULLABLE      |
| organizer         | VARCHAR(200) | NULLABLE                           |
| registration_link | TEXT         | NULLABLE                           |
| event_image_url   | TEXT         | NULLABLE                           |
| is_active         | BOOLEAN      | DEFAULT true                       |
| created_by        | UUID         | FK → users.id, NOT NULL            |
| created_at        | TIMESTAMP    | DEFAULT NOW()                      |
| updated_at        | TIMESTAMP    | DEFAULT NOW()                      |

### notifications
| Column       | Type         | Constraints                            |
|--------------|--------------|----------------------------------------|
| id           | UUID         | PK                                     |
| user_id      | UUID         | FK → users.id, ON DELETE CASCADE       |
| title        | VARCHAR(300) | NOT NULL                               |
| message      | TEXT         | NOT NULL                               |
| type         | ENUM         | new_resource/approval/rejection/announcement/event/admin_message |
| reference_id | UUID         | NULLABLE (points to resource/event/etc)|
| is_read      | BOOLEAN      | DEFAULT false                          |
| created_at   | TIMESTAMP    | DEFAULT NOW()                          |

### activity_logs
| Column      | Type         | Constraints                       |
|-------------|--------------|-----------------------------------|
| id          | UUID         | PK                                |
| user_id     | UUID         | FK → users.id, NULLABLE           |
| action      | VARCHAR(100) | NOT NULL                          |
| entity_type | VARCHAR(50)  | NULLABLE (resource, user, …)      |
| entity_id   | UUID         | NULLABLE                          |
| metadata    | JSONB        | NULLABLE                          |
| ip_address  | INET         | NULLABLE                          |
| created_at  | TIMESTAMP    | DEFAULT NOW()                     |

---

## Indexes

```sql
-- users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);

-- resources
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_department ON resources(department_id);
CREATE INDEX idx_resources_subject ON resources(subject_id);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_semester ON resources(semester);
CREATE INDEX idx_resources_uploaded_by ON resources(uploaded_by);
CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);
CREATE INDEX idx_resources_downloads ON resources(download_count DESC);

-- bookmarks / downloads
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_downloads_resource ON downloads(resource_id);

-- notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- activity_logs
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
```
