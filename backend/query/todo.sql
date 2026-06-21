-- name: GetTodos :many
select * from todos 
where user_id = $1;

-- name: CreateTodo :one
insert into todos (text, user_id)
values ($1, $2)
returning *;

-- name: UpdateTodo :one
update todos
set text = $1
where id = $2 and user_id = $3
returning *;

-- name: DeleteTodo :one
delete from todos
where id = $1 and user_id = $2
returning *;

-- name: UpdateTodoStatus :one
update todos
set status = $1
where id = $2 and user_id = $3
returning *;