package postgres

import (
	"context"
	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type logRepository struct {
	queries *db.Queries
}

func NewLogRepository(queries *db.Queries) repository.LogRepository {
	return &logRepository{queries: queries}
} 

func (r *logRepository) GetDailyLogs(ctx context.Context, userID, from, to string) ([]entity.DailyLog, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return nil, err
	}
	pgFrom, err := stringToPgDate(from)
	if err != nil {
		return nil, err
	}
	pgTo, err := stringToPgDate(to)
	if err != nil {
		return nil, err
	}

	rows, err := r.queries.GetDailyLogs(ctx, db.GetDailyLogsParams{
		UserID: pgUserID,
		LogDate: pgFrom,
		LogDate_2: pgTo,
	})
	if err != nil {
		return nil, err
	}
	return toEntityDailyLogs(rows)
}

func (r *logRepository) CatchUp(ctx context.Context, userID string) error {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return err
	}
	return r.queries.CatchUpDailyLogs(ctx, pgUserID)
}