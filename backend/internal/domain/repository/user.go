package repository

import (
	"context"
	"pathway-backend/internal/domain/entity"
)

type UserRepository interface {
	GetUser(ctx context.Context, id string) (entity.User, error)
}