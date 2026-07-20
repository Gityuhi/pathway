package postgres

import (
	"context"

	db "pathway-backend/db/sqlc"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type roadmapRepository struct {
	pool    *pgxpool.Pool
	queries *db.Queries
}

func NewRoadmapRepository(pool *pgxpool.Pool, queries *db.Queries) repository.RoadmapRepository {
	return &roadmapRepository{pool: pool, queries: queries}
}

func (r *roadmapRepository) ListRoadmaps(ctx context.Context, userID string) ([]entity.Roadmap, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return nil, err
	}
	rows, err := r.queries.ListRoadmaps(ctx, pgUserID)
	if err != nil {
		return nil, err
	}
	return toEntityRoadmaps(rows)
}

func (r *roadmapRepository) CreateRoadmapWithRoot(ctx context.Context, userID, title string) (entity.Roadmap, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Roadmap{}, err
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return entity.Roadmap{}, err
	}
	defer tx.Rollback(ctx)

	qtx := r.queries.WithTx(tx)

	roadmap, err := qtx.CreateRoadmap(ctx, db.CreateRoadmapParams{
		UserID: pgUserID,
		Title:  title,
	})
	if err != nil {
		return entity.Roadmap{}, err
	}

	_, err = qtx.CreateNode(ctx, db.CreateNodeParams{
		RoadmapID: roadmap.ID,
		ParentID:  pgtype.UUID{},
		Title:     title,
	})
	if err != nil {
		return entity.Roadmap{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return entity.Roadmap{}, err
	}

	return toEntityRoadmap(roadmap)
}

func (r *roadmapRepository) GetRoadmapByIDAndUser(ctx context.Context, userID, roadmapID string) (entity.Roadmap, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.Roadmap{}, err
	}
	pgRoadmapID, err := stringToPgUUID(roadmapID)
	if err != nil {
		return entity.Roadmap{}, err
	}
	row, err := r.queries.GetRoadmapByIDAndUser(ctx, db.GetRoadmapByIDAndUserParams{
		ID:     pgRoadmapID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.Roadmap{}, mapError(err)
	}
	return toEntityRoadmap(row)
}

func (r *roadmapRepository) ListNodesByRoadmap(ctx context.Context, userID, roadmapID string) ([]entity.RoadmapNode, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return nil, err
	}
	pgRoadmapID, err := stringToPgUUID(roadmapID)
	if err != nil {
		return nil, err
	}
	rows, err := r.queries.ListNodesByRoadmap(ctx, db.ListNodesByRoadmapParams{
		RoadmapID: pgRoadmapID,
		UserID:    pgUserID,
	})
	if err != nil {
		return nil, err
	}
	return toEntityRoadmapNodes(rows)
}

func (r *roadmapRepository) GetNodeByIDAndUser(ctx context.Context, userID, nodeID string) (entity.RoadmapNode, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	pgNodeID, err := stringToPgUUID(nodeID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	row, err := r.queries.GetNodeByIDAndUser(ctx, db.GetNodeByIDAndUserParams{
		ID:     pgNodeID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.RoadmapNode{}, mapError(err)
	}
	return toEntityRoadmapNode(row)
}

func (r *roadmapRepository) CreateNode(
	ctx context.Context,
	userID, roadmapID string,
	parentID *string,
	title string,
) (entity.RoadmapNode, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	pgRoadmapID, err := stringToPgUUID(roadmapID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}

	pgParentID := pgtype.UUID{}
	if parentID != nil {
		pgParentID, err = stringToPgUUID(*parentID)
		if err != nil {
			return entity.RoadmapNode{}, err
		}
	}

	if _, err := r.queries.GetRoadmapByIDAndUser(ctx, db.GetRoadmapByIDAndUserParams{
		ID:     pgRoadmapID,
		UserID: pgUserID,
	}); err != nil {
		return entity.RoadmapNode{}, mapError(err)
	}

	row, err := r.queries.CreateNode(ctx, db.CreateNodeParams{
		RoadmapID: pgRoadmapID,
		ParentID:  pgParentID,
		Title:     title,
	})
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	return toEntityRoadmapNode(row)
}

func (r *roadmapRepository) DeleteNode(ctx context.Context, userID, nodeID string) (entity.RoadmapNode, error) {
	pgUserID, err := stringToPgUUID(userID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	pgNodeID, err := stringToPgUUID(nodeID)
	if err != nil {
		return entity.RoadmapNode{}, err
	}
	row, err := r.queries.DeleteNode(ctx, db.DeleteNodeParams{
		ID:     pgNodeID,
		UserID: pgUserID,
	})
	if err != nil {
		return entity.RoadmapNode{}, mapError(err)
	}
	return toEntityRoadmapNode(row)
}
