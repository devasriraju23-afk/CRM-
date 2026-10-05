-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID        NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT bookmarks_unique UNIQUE (user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user     ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_resource ON bookmarks(resource_id);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id   UUID        NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address    INET
);

CREATE INDEX IF NOT EXISTS idx_downloads_user     ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_resource ON downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date     ON downloads(downloaded_at DESC);
