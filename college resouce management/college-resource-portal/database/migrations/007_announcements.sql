-- Announcement priority enum
DO $$ BEGIN
  CREATE TYPE announcement_priority AS ENUM ('normal', 'important', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id            UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(300)          NOT NULL,
  description   TEXT                  NOT NULL,
  department_id UUID                  REFERENCES departments(id) ON DELETE SET NULL,
  priority      announcement_priority NOT NULL DEFAULT 'normal',
  published_at  TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ,
  created_by    UUID                  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active     BOOLEAN               NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_department ON announcements(department_id);
CREATE INDEX IF NOT EXISTS idx_announcements_priority   ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_active     ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_published  ON announcements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_expires    ON announcements(expires_at) WHERE expires_at IS NOT NULL;

CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
