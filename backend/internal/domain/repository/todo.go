package repository

import (
	"context"
	"pathway-backend/internal/domain/entity"
)

type TodoRepository interface {
	GetTodos(ctx context.Context, userID string) ([]entity.Todo, error)
	CreateTodo(ctx context.Context, userID, text string) (entity.Todo, error)
	UpdateTodo(ctx context.Context, userID, id string, text string) (entity.Todo, error)
	DeleteTodo(ctx context.Context, userID, id string) (entity.Todo, error)
	EditStatusTodo(ctx context.Context, userID, id string, status entity.TodoStatus) (entity.Todo, error)
}