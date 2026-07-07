-- name: GetDailyLogs :many
select log_date, is_completed from daily_logs
where user_id = $1 and log_date >= $2 and log_date < $3;


-- name: CatchUpDailyLogs :exec
INSERT INTO daily_logs (user_id, log_date, is_completed)
SELECT todos.user_id,
        (todos.created_at AT TIME ZONE 'Asia/Tokyo')::date,
        bool_and(todos.status = 'COMPLETED')
FROM todos
WHERE todos.user_id = $1 and
    (todos.created_at AT TIME ZONE 'Asia/Tokyo')::date
    < (now() AT TIME ZONE 'Asia/Tokyo')::date
GROUP BY todos.user_id, (todos.created_at AT TIME ZONE 'Asia/Tokyo')::date
ON CONFLICT (user_id, log_date) DO NOTHING;