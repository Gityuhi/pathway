package graph

import (
	"context"
	"pathway-backend/graph/model"
	"pathway-backend/internal/domain/entity"
	"pathway-backend/internal/domain/repository"
	"time"
)

func ToModelTodo(ctx context.Context, users repository.UserRepository, todo entity.Todo) (*model.Todo, error) {
	user, err := users.GetUser(ctx, todo.UserID)
	if err != nil {
		return nil, err
	}

	return &model.Todo{
		ID:     todo.ID,
		Text:   todo.Text,
		Status: model.TodoStatus(todo.Status),
		User:   &model.User{
			ID:   user.ID,
			Name: user.Name,
		}, 
	}, nil
}

func ToModelTodos(ctx context.Context, users repository.UserRepository, todos []entity.Todo) ([]*model.Todo, error) {
	if len(todos) == 0 {
		return []*model.Todo{}, nil
	}

	result := make([]*model.Todo, 0, len(todos))
	for _, todo := range todos {
		m, err := ToModelTodo(ctx, users, todo)
		if err != nil {
			return nil, err
		}
		result = append(result, m)
	}
	return result, nil
}

func ToModelDailyLog(log entity.DailyLog) *model.DailyLog {
	return &model.DailyLog{
		Date:        log.Date,
		IsCompleted: log.IsCompleted,
	}
}

func ToModelDailyLogs(logs []entity.DailyLog) []*model.DailyLog {
	if len(logs) == 0 {
		return []*model.DailyLog{}
	}
	result := make([]*model.DailyLog, 0, len(logs))
	for _, log := range logs {
		result = append(result, ToModelDailyLog(log))
	}
	return result
}

func ToModelRoadmap(roadmap entity.Roadmap) *model.Roadmap {
	return &model.Roadmap{
		ID:        roadmap.ID,
		Title:     roadmap.Title,
		CreatedAt: roadmap.CreatedAt.UTC().Format(time.RFC3339),
	}
}

func ToModelRoadmaps(roadmaps []entity.Roadmap) []*model.Roadmap {
	if len(roadmaps) == 0 {
		return []*model.Roadmap{}
	}
	result := make([]*model.Roadmap, 0, len(roadmaps))
	for _, roadmap := range roadmaps {
		result = append(result, ToModelRoadmap(roadmap))
	}
	return result
}

func ToModelRoadmapNode(node entity.RoadmapNode) *model.RoadmapNode {
	return &model.RoadmapNode{
		ID:        node.ID,
		RoadmapID: node.RoadmapID,
		ParentID:  node.ParentID,
		Title:     node.Title,
	}
}

func ToModelRoadmapNodes(nodes []entity.RoadmapNode) []*model.RoadmapNode {
	if len(nodes) == 0 {
		return []*model.RoadmapNode{}
	}
	result := make([]*model.RoadmapNode, 0, len(nodes))
	for _, node := range nodes {
		result = append(result, ToModelRoadmapNode(node))
	}
	return result
}