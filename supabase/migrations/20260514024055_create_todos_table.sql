CREATE TYPE todoStatus AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  status todoStatus NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

