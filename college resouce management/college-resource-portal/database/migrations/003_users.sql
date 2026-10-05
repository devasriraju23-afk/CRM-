-- Role enum
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role    NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  department_id UUID         REFERENCES departments(id) ON DELETE SET NULL,
  semester      INTEGER      CHECK (semester BETWEEN 1 AND 8),
  roll_number   VARCHAR(50),
  employee_id   VARCHAR(50),
  avatar_url    TEXT,
  bio           TEXT,
  phone         VARCHAR(20),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_email        ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role         ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department   ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_active       ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_roll_number  ON users(roll_number) WHERE roll_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_employee_id  ON users(employee_id) WHERE employee_id IS NOT NULL;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
