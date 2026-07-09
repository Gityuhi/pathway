package usecase

import (
	"context"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type LogService struct {
	logs repository.LogRepository
}

func NewLogService(logs repository.LogRepository) *LogService {
	return &LogService{logs: logs}
}

func (s *LogService) GetDailyLogs(ctx context.Context, userID, from, to string) ([]entity.DailyLog, error) {
	return s.logs.GetDailyLogs(ctx, userID, from, to)
}

func (s *LogService) CatchUp(ctx context.Context, userID string) error {
	return s.logs.CatchUp(ctx, userID)
}