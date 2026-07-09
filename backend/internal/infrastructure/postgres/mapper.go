package postgres

import (
	"errors"
	"fmt"
	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain"
	"pathway-backend/internal/domain/entity"
	"time"

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

func stringToPgDate(s string) (pgtype.Date, error) {
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return pgtype.Date{}, fmt.Errorf("parse date: %w", err)
	}
	return pgtype.Date{Time: t, Valid: true}, nil
}

func pgDateToString(d pgtype.Date) (string, error) {
	if !d.Valid {
		return "", fmt.Errorf("invalid date")
	}
	return d.Time.Format("2006-01-02"), nil
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

func toEntityDailyLog(row db.GetDailyLogsRow) (entity.DailyLog, error) {
	date, err := pgDateToString(row.LogDate)
	if err != nil {
		return entity.DailyLog{}, err
	}
	return entity.DailyLog{
		Date:        date,
		IsCompleted: row.IsCompleted,
	}, nil
}

func toEntityDailyLogs(rows []db.GetDailyLogsRow) ([]entity.DailyLog, error) {
	logs := make([]entity.DailyLog, 0, len(rows))
	for _, row := range rows {
		log, err := toEntityDailyLog(row)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}
	return logs, nil
}

// resolverのエラーハンドリング用
func mapError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.ErrNotFound
	}
	return err
}