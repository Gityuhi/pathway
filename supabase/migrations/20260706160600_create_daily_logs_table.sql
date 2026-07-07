CREATE TABLE daily_logs (
    user_id       UUID REFERENCES users(id) NOT NULL,
    log_date      DATE NOT NULL,
    is_completed  BOOLEAN NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, log_date)
);