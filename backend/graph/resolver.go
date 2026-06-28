package graph

import (
	"pathway-backend/internal/domain/repository"
	"pathway-backend/internal/usecase"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

type Resolver struct{
	TodoService *usecase.TodoService
	Users       repository.UserRepository
}
