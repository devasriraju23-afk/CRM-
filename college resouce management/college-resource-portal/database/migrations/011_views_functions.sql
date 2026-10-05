-- ─────────────────────────────────────────────────────────────────────────────
-- Useful database views and helper functions
-- ─────────────────────────────────────────────────────────────────────────────

-- Resource summary view (approved resources with uploader and department info)
CREATE OR REPLACE VIEW v_resources AS
SELECT
  r.id,
  r.title,
  r.description,
  r.resource_type,
  r.category,
  r.semester,
  r.file_url,
  r.file_type,
  r.file_size,
  r.thumbnail_url,
  r.status,
  r.download_count,
  r.view_count,
  r.created_at,
  r.updated_at,
  r.rejection_reason,
  d.id   AS department_id,
  d.name AS department_name,
  d.code AS department_code,
  s.id   AS subject_id,
  s.name AS subject_name,
  s.code AS subject_code,
  u.id         AS uploader_id,
  u.first_name AS uploader_first_name,
  u.last_name  AS uploader_last_name,
  u.email      AS uploader_email,
  ARRAY(
    SELECT tag FROM resource_tags WHERE resource_id = r.id ORDER BY tag
  ) AS tags
FROM resources r
JOIN departments d ON d.id = r.department_id
LEFT JOIN subjects s ON s.id = r.subject_id
JOIN users u ON u.id = r.uploaded_by;

-- Announcement summary view
CREATE OR REPLACE VIEW v_announcements AS
SELECT
  a.id,
  a.title,
  a.description,
  a.priority,
  a.published_at,
  a.expires_at,
  a.is_active,
  a.created_at,
  d.id   AS department_id,
  d.name AS department_name,
  u.id         AS author_id,
  u.first_name AS author_first_name,
  u.last_name  AS author_last_name
FROM announcements a
LEFT JOIN departments d ON d.id = a.department_id
JOIN users u ON u.id = a.created_by;

-- Event summary view
CREATE OR REPLACE VIEW v_events AS
SELECT
  e.id,
  e.name,
  e.description,
  e.event_date,
  e.event_time,
  e.venue,
  e.organizer,
  e.registration_link,
  e.event_image_url,
  e.is_active,
  e.created_at,
  d.id   AS department_id,
  d.name AS department_name,
  u.id         AS creator_id,
  u.first_name AS creator_first_name,
  u.last_name  AS creator_last_name
FROM events e
LEFT JOIN departments d ON d.id = e.department_id
JOIN users u ON u.id = e.created_by;

-- ── Analytics helper function ─────────────────────────────────────────────────

-- Returns monthly download counts for the last N months
CREATE OR REPLACE FUNCTION get_monthly_downloads(months_back INTEGER DEFAULT 6)
RETURNS TABLE(month TEXT, total BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', downloaded_at), 'Mon YYYY') AS month,
    COUNT(*) AS total
  FROM downloads
  WHERE downloaded_at >= DATE_TRUNC('month', NOW()) - ((months_back - 1) || ' months')::INTERVAL
  GROUP BY DATE_TRUNC('month', downloaded_at)
  ORDER BY DATE_TRUNC('month', downloaded_at);
END;
$$ LANGUAGE plpgsql;

-- Returns monthly upload counts for the last N months
CREATE OR REPLACE FUNCTION get_monthly_uploads(months_back INTEGER DEFAULT 6)
RETURNS TABLE(month TEXT, total BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') AS month,
    COUNT(*) AS total
  FROM resources
  WHERE created_at >= DATE_TRUNC('month', NOW()) - ((months_back - 1) || ' months')::INTERVAL
  GROUP BY DATE_TRUNC('month', created_at)
  ORDER BY DATE_TRUNC('month', created_at);
END;
$$ LANGUAGE plpgsql;
