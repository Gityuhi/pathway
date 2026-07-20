package repository

import (
	"context"

	"pathway-backend/internal/domain/entity"
)

type RoadmapRepository interface {
	ListRoadmaps(ctx context.Context, userID string) ([]entity.Roadmap, error)
	CreateRoadmapWithRoot(ctx context.Context, userID, title string) (entity.Roadmap, error)
	GetRoadmapByIDAndUser(ctx context.Context, userID, roadmapID string) (entity.Roadmap, error)
	ListNodesByRoadmap(ctx context.Context, userID, roadmapID string) ([]entity.RoadmapNode, error)
	GetNodeByIDAndUser(ctx context.Context, userID, nodeID string) (entity.RoadmapNode, error)
	CreateNode(ctx context.Context, userID, roadmapID string, parentID *string, title string) (entity.RoadmapNode, error)
	UpdateNode(ctx context.Context, userID, nodeID, title string) (entity.RoadmapNode, error)
	DeleteNode(ctx context.Context, userID, nodeID string) (entity.RoadmapNode, error)
}
