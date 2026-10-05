-- Notification type enum
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'new_resource', 'approval', 'rejection',
    'announcement', 'event', 'admin_message'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(300)      NOT NULL,
  message      TEXT              NOT NULL,
  type         notification_type NOT NULL,
  reference_id UUID,
  is_read      BOOLEAN           NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read)
  WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_date   ON notifications(created_at DESC);
