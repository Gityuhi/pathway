package entity

type TodoStatus string

const (
	TodoStatusNotStarted TodoStatus = "NOT_STARTED"
	TodoStatusInProgress TodoStatus = "IN_PROGRESS"
	TodoStatusCompleted  TodoStatus = "COMPLETED"
)

func (s TodoStatus) IsValid() bool {
	switch s {
	case TodoStatusNotStarted, TodoStatusInProgress, TodoStatusCompleted:
		return true
	default:
		return false
	}
}

type Todo struct {
	ID string
	Text string
	Status TodoStatus
	User User
}
