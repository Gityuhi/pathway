package usecase

import (
	"context"
	"fmt"

	"pathway-backend/internal/domain"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
)

type RoadmapService struct {
	roadmaps repository.RoadmapRepository
}

func NewRoadmapService(roadmaps repository.RoadmapRepository) *RoadmapService {
	return &RoadmapService{roadmaps: roadmaps}
}

func (s *RoadmapService) ListRoadmaps(ctx context.Context, userID string) ([]entity.Roadmap, error) {
	return s.roadmaps.ListRoadmaps(ctx, userID)
}

func (s *RoadmapService) CreateRoadmap(ctx context.Context, userID, title string) (entity.Roadmap, error) {
	return s.roadmaps.CreateRoadmapWithRoot(ctx, userID, title)
}

func (s *RoadmapService) ListNodes(ctx context.Context, userID, roadmapID string) ([]entity.RoadmapNode, error) {
	if _, err := s.roadmaps.GetRoadmapByIDAndUser(ctx, userID, roadmapID); err != nil {
		return nil, err
	}
	return s.roadmaps.ListNodesByRoadmap(ctx, userID, roadmapID)
}

func (s *RoadmapService) CreateNode(
	ctx context.Context,
	userID, roadmapID string,
	parentID *string,
	title string,
) (entity.RoadmapNode, error) {
	if _, err := s.roadmaps.GetRoadmapByIDAndUser(ctx, userID, roadmapID); err != nil {
		return entity.RoadmapNode{}, err
	}

	if parentID != nil {
		parent, err := s.roadmaps.GetNodeByIDAndUser(ctx, userID, *parentID)
		if err != nil {
			return entity.RoadmapNode{}, err
		}
		if parent.RoadmapID != roadmapID {
			return entity.RoadmapNode{}, fmt.Errorf("parent node does not belong to roadmap: %w", domain.ErrNotFound)
		}
	}

	return s.roadmaps.CreateNode(ctx, userID, roadmapID, parentID, title)
}

func (s *RoadmapService) UpdateNode(ctx context.Context, userID, nodeID, title string) (entity.RoadmapNode, error) {
	return s.roadmaps.UpdateNode(ctx, userID, nodeID, title)
}

func (s *RoadmapService) DeleteNode(ctx context.Context, userID, nodeID string) (entity.RoadmapNode, error) {
	return s.roadmaps.DeleteNode(ctx, userID, nodeID)
}
