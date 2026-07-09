package repository

import (
	"context"
	"pathway-backend/internal/domain/entity"
)

type LogRepository interface {
	GetDailyLogs(ctx context.Context, userID, from, to string) ([]entity.DailyLog, error)
	CatchUp(ctx context.Context, userID string) error
}