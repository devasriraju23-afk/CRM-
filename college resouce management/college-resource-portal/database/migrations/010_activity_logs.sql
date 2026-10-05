-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  metadata    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user    ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action  ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity  ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
-- GIN index for querying JSONB metadata
CREATE INDEX IF NOT EXISTS idx_activity_logs_meta    ON activity_logs USING GIN(metadata);
