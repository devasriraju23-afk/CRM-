-- Events table
CREATE TABLE IF NOT EXISTS events (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(300) NOT NULL,
  description       TEXT,
  event_date        DATE         NOT NULL,
  event_time        TIME,
  venue             VARCHAR(300),
  department_id     UUID         REFERENCES departments(id) ON DELETE SET NULL,
  organizer         VARCHAR(200),
  registration_link TEXT,
  event_image_url   TEXT,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_by        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date       ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_department ON events(department_id);
CREATE INDEX IF NOT EXISTS idx_events_active     ON events(is_active);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
