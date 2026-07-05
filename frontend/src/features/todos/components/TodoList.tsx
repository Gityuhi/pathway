import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { graphql } from "@/generated"
import type { TodoStatus } from "@/generated/graphql"

const TodosDocument = graphql(`
  query Todos {
    todos {
      id
      text
      status
      user {
        id
        name
      }
    }
  }
`)

const UpdateTodoDocument = graphql(`
  mutation UpdateTodo($id: ID!, $input: UpdateTodo!) {
    updateTodo(id: $id, input: $input) {
      id
      text
      status
    }
  }
`)

const UpdateTodoStatusDocument = graphql(`
  mutation UpdateTodoStatus($id: ID!, $input: UpdateTodoStatus!) {
    updateTodoStatus(id: $id, input: $input) {
      id
      text
      status
    }
  }
`)

const DeleteTodoDocument = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`)

const STATUS_LABELS: Record<TodoStatus, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "着手",
  COMPLETED: "完了",
}

const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
  NOT_STARTED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "NOT_STARTED",
}

type TodoItem = {
  id: string
  text: string
  status: TodoStatus
  user: {
    id: string
    name: string
  }
}

function TodoRow({ todo }: { todo: TodoItem }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const [updateTodo, { loading: updating }] = useMutation(UpdateTodoDocument, {
    refetchQueries: ["Todos"],
  })
  const [updateTodoStatus, { loading: updatingStatus }] = useMutation(
    UpdateTodoStatusDocument,
    { refetchQueries: ["Todos"] },
  )
  const [deleteTodo, { loading: deleting }] = useMutation(DeleteTodoDocument, {
    refetchQueries: ["Todos"],
  })

  const busy = updating || updatingStatus || deleting

  const handleStatusClick = async () => {
    await updateTodoStatus({
      variables: {
        id: todo.id,
        input: { status: NEXT_STATUS[todo.status] },
      },
    })
  }

  const handleSaveEdit = async () => {
    const trimmed = editText.trim()
    if (!trimmed) return

    await updateTodo({
      variables: { id: todo.id, input: { text: trimmed } },
    })
    setEditing(false)
  }

  const handleCancelEdit = () => {
    setEditText(todo.text)
    setEditing(false)
  }

  const handleDelete = async () => {
    await deleteTodo({ variables: { id: todo.id } })
  }

  return (
    <li className="flex items-center gap-2 border-b py-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-20 shrink-0"
        onClick={handleStatusClick}
        disabled={busy}
      >
        {STATUS_LABELS[todo.status]}
      </Button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              disabled={busy}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              disabled={busy || !editText.trim()}
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={busy}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <span className="block truncate">{todo.text}</span>
        )}
      </div>

      {!editing && (
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setEditText(todo.text)
              setEditing(true)
            }}
            disabled={busy}
          >
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={busy}
          >
            Delete
          </Button>
        </div>
      )}
    </li>
  )
}

export function TodoList() {
  const { data, loading, error } = useQuery(TodosDocument)

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading todos...</p>
  }

  if (error) {
    return <p className="text-destructive text-sm">{error.message}</p>
  }

  const todos = data?.todos ?? []

  if (todos.length === 0) {
    return <p className="text-muted-foreground text-sm">No todos yet.</p>
  }

  return (
    <ul className="divide-y">
      {todos.map((todo) => (
        <TodoRow key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
