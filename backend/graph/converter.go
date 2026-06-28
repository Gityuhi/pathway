package graph

import (
	"context"
	"pathway-backend/graph/model"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

func ToModelTodo(ctx context.Context, users repository.UserRepository, todo entity.Todo) (*model.Todo, error) {
	user, err := users.GetUser(ctx, todo.UserID)
	if err != nil {
		return nil, err
	}

	return &model.Todo{
		ID:     todo.ID,
		Text:   todo.Text,
		Status: model.TodoStatus(todo.Status),
		User:   &model.User{
			ID:   user.ID,
			Name: user.Name,
		}, 
	}, nil
}

func ToModelTodos(ctx context.Context, users repository.UserRepository, todos []entity.Todo) ([]*model.Todo, error) {
	if len(todos) == 0 {
		return []*model.Todo{}, nil
	}

	result := make([]*model.Todo, 0, len(todos))
	for _, todo := range todos {
		m, err := ToModelTodo(ctx, users, todo)
		if err != nil {
			return nil, err
		}
		result = append(result, m)
	}
	return result, nil
}