import { CreateTodo } from "./CreateTodo"
import { TodoList } from "./TodoList"

export function TodoApp() {
  return (
    <div className="flex flex-col gap-6">
      <CreateTodo />
      <TodoList />
    </div>
  )
}
