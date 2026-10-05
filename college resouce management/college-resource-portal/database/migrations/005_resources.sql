-- Resource type enum
DO $$ BEGIN
  CREATE TYPE resource_type AS ENUM (
    'notes', 'question_papers', 'assignments', 'lab_manuals',
    'syllabus', 'ebooks', 'presentations', 'study_materials', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Resource status enum
DO $$ BEGIN
  CREATE TYPE resource_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(300)    NOT NULL,
  description      TEXT,
  resource_type    resource_type   NOT NULL,
  category         VARCHAR(100),
  department_id    UUID            NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  subject_id       UUID            REFERENCES subjects(id) ON DELETE SET NULL,
  semester         INTEGER         CHECK (semester BETWEEN 1 AND 8),
  file_url         TEXT            NOT NULL,
  file_key         TEXT            NOT NULL,
  file_type        VARCHAR(50)     NOT NULL,
  file_size        BIGINT          NOT NULL CHECK (file_size > 0),
  thumbnail_url    TEXT,
  uploaded_by      UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status           resource_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  download_count   INTEGER         NOT NULL DEFAULT 0,
  view_count       INTEGER         NOT NULL DEFAULT 0,
  search_vector    TSVECTOR,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resources_status      ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_department  ON resources(department_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject     ON resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_resources_type        ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_semester    ON resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON resources(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_resources_created_at  ON resources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_downloads   ON resources(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_views       ON resources(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_resources_search      ON resources USING GIN(search_vector);
-- Trigram index for partial-match title search
CREATE INDEX IF NOT EXISTS idx_resources_title_trgm  ON resources USING GIN(title gin_trgm_ops);

-- Auto-update search_vector and updated_at
CREATE OR REPLACE FUNCTION resources_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')),       'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.category, '')),    'C');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resources_search_vector_trigger
  BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION resources_search_vector_update();

-- Resource tags table
CREATE TABLE IF NOT EXISTS resource_tags (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID        NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  tag         VARCHAR(50) NOT NULL,

  CONSTRAINT resource_tags_unique UNIQUE (resource_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_resource_tags_resource ON resource_tags(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_tags_tag      ON resource_tags(tag);
