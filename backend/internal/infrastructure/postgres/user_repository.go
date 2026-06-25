package postgres

import (
	"context"
	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type userRepository struct {
	queries *db.Queries
}

func NewUserRepository(queries *db.Queries) repository.UserRepository {
	return &userRepository{queries: queries}
}


func (r *userRepository) GetUser(ctx context.Context, id string) (entity.User, error) {
	pgID, err := stringToPgUUID(id)
	if err != nil {
		return entity.User{}, err
	}
	row, err := r.queries.GetUser(ctx, pgID)
	if err != nil {
		return entity.User{}, err
	}
	return toEntityUser(row)
}