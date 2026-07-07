SELECT cron.schedule(
  'freeze-daily-logs',
  '5 15 * * *',
  $$
  INSERT INTO daily_logs (user_id, log_date, is_completed)
  SELECT user_id,
         (created_at AT TIME ZONE 'Asia/Tokyo')::date,
         bool_and(status = 'COMPLETED')
  FROM todos
  WHERE (created_at AT TIME ZONE 'Asia/Tokyo')::date
        = (now() AT TIME ZONE 'Asia/Tokyo')::date - 1
  GROUP BY user_id, (created_at AT TIME ZONE 'Asia/Tokyo')::date
  ON CONFLICT (user_id, log_date) DO NOTHING;
  $$
);