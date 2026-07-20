package entity

import "time"

type Roadmap struct {
	ID        string
	UserID    string
	Title     string
	CreatedAt time.Time
}

type RoadmapNode struct {
	ID        string
	RoadmapID string
	ParentID  *string
	Title     string
}
