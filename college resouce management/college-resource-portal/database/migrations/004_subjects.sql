-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  code          VARCHAR(50)  NOT NULL,
  department_id UUID         NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  semester      INTEGER      NOT NULL CHECK (semester BETWEEN 1 AND 8),
  credits       INTEGER      CHECK (credits > 0),
  description   TEXT,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT subjects_code_unique UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester   ON subjects(semester);
CREATE INDEX IF NOT EXISTS idx_subjects_active     ON subjects(is_active);

CREATE TRIGGER subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
