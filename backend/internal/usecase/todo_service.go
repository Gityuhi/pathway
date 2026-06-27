package usecase

import (
	"context"
	"fmt"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type TodoService struct {
	todos repository.TodoRepository
}

func NewTodoService(todos repository.TodoRepository) *TodoService {
	return &TodoService{todos: todos}
}

func (s *TodoService) GetTodos(ctx context.Context, userID string) ([]entity.Todo, error) {
	return s.todos.GetTodos(ctx, userID)
}

func (s *TodoService) CreateTodo(ctx context.Context, userID, text string) (entity.Todo, error) {
	return s.todos.CreateTodo(ctx, userID, text)
}

func (s *TodoService) UpdateTodo(ctx context.Context, userID, id, text string) (entity.Todo, error) {
	return s.todos.UpdateTodo(ctx, userID, id, text)
}

func (s *TodoService) DeleteTodo(ctx context.Context, userID, id string) (entity.Todo, error) {
	return s.todos.DeleteTodo(ctx, userID, id)
}

func (s *TodoService) UpdateTodoStatus(ctx context.Context, userID, id string, status entity.TodoStatus) (entity.Todo, error) {
	if !status.IsValid() {
		return entity.Todo{}, fmt.Errorf("invalid status: %q", status)
	}
	return s.todos.UpdateTodoStatus(ctx, userID, id, status)
}