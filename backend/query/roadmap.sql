-- name: ListRoadmaps :many
select *
from roadmaps
where user_id = $1
order by created_at;

-- name: CreateRoadmap :one
insert into roadmaps (user_id, title)
values ($1, $2)
returning *;

-- name: GetRoadmapByIDAndUser :one
select *
from roadmaps
where id = $1
  and user_id = $2;

-- name: ListNodesByRoadmap :many
select n.*
from nodes n
join roadmaps r on n.roadmap_id = r.id
where n.roadmap_id = $1
  and r.user_id = $2
order by n.created_at;

-- name: CreateNode :one
insert into nodes (roadmap_id, parent_id, title)
values ($1, $2, $3)
returning *;

-- name: GetNodeByIDAndUser :one
select n.*
from nodes n
join roadmaps r on n.roadmap_id = r.id
where n.id = $1
  and r.user_id = $2;

-- name: DeleteNode :one
delete from nodes n
using roadmaps r
where n.id = $1
  and n.roadmap_id = r.id
  and r.user_id = $2
returning n.*;
