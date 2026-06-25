package postgres

import (
	"errors"
	"fmt"
	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain"
	"pathway-backend/internal/domain/entity"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func stringToPgUUID(s string) (pgtype.UUID, error) {
	parsed, err := uuid.Parse(s)
	if err != nil {
		return pgtype.UUID{}, fmt.Errorf("parse uuid: %w", err)
	}
	return pgtype.UUID{Bytes: parsed, Valid: true}, nil
}

func pgUUIDToString(p pgtype.UUID) (string, error) {
	if !p.Valid {
		return "", fmt.Errorf("invalid uuid")
	}
	return p.String(), nil
}


func toEntityTodo(row db.Todo) (entity.Todo, error) {
	id, err := pgUUIDToString(row.ID)
	if err != nil {
		return entity.Todo{}, err
	}
	userID, err := pgUUIDToString(row.UserID)
	if err != nil {
		return entity.Todo{}, err
	}

	return entity.Todo{
		ID: id, 
		Text: row.Text,
		Status: entity.TodoStatus(row.Status),
		UserID: userID,
	}, nil
}

func toEntityTodos(rows []db.Todo) ([]entity.Todo, error) {
	todos := make([]entity.Todo, 0, len(rows))
	for _, row := range rows {
		todo, err := toEntityTodo(row)
		if err != nil {
			return nil, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}

func toEntityUser(row db.User) (entity.User, error) {
	id, err := pgUUIDToString(row.ID)
	if err != nil {
		return entity.User{}, err
	}
	return entity.User{
		ID:   id,
		Name: row.Name,
	}, nil
}

// resolverのエラーハンドリング用
func mapError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.ErrNotFound
	}
	return err
}