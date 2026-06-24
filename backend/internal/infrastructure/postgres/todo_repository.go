package postgres

import (
	"context"
	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type todoRepository struct {
	queries *db.Queries
}


func NewTodoRepository(queries *db.Queries) repository.TodoRepository {
	return &todoRepository{queries: queries}
}

func (r *todoRepository) GetTodos(ctx context.Context, userID string) ([]entity.Todo, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return nil, err
	}
	rows, err := r.queries.GetTodos(ctx, pgUserID)
	if err != nil {
		return nil, err
	}
	return toEntityTodos(rows)
}


func (r *todoRepository) CreateTodo(ctx context.Context, userID, text string) (entity.Todo, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Todo{}, err
	}
	row, err := r.queries.CreateTodo(ctx, db.CreateTodoParams{
		Text: text,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.Todo{}, err
	}
	return toEntityTodo(row)
}


func (r *todoRepository) UpdateTodo(ctx context.Context, userID, id string, text string) (entity.Todo, error) {
	pgID, err := stringToPgUUID(id)
	if err != nil {
		return entity.Todo{}, err
	}
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Todo{}, err
	}
	row, err := r.queries.UpdateTodo(ctx, db.UpdateTodoParams{
		Text:   text,
		ID:     pgID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.Todo{}, mapError(err)
	}
	return toEntityTodo(row)
}


func (r *todoRepository) DeleteTodo(ctx context.Context, userID, id string) (entity.Todo, error) {
	pgID, err := stringToPgUUID(id)
	if err != nil {
		return entity.Todo{}, err
	}
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Todo{}, err
	}
	row, err := r.queries.DeleteTodo(ctx, db.DeleteTodoParams{
		ID:     pgID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.Todo{}, mapError(err)
	}
	return toEntityTodo(row)
}


func (r *todoRepository) UpdateTodoStatus(ctx context.Context, userID, id string, status entity.TodoStatus) (entity.Todo, error) {
	pgID, err := stringToPgUUID(id)
	if err != nil {
		return entity.Todo{}, err
	}
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Todo{}, err
	}
	row, err := r.queries.UpdateTodoStatus(ctx, db.UpdateTodoStatusParams{
		Status: db.TodoStatus(status),
		ID:     pgID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.Todo{}, mapError(err)
	}
	return toEntityTodo(row)
}