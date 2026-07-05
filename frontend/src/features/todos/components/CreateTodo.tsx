import { useState, type FormEvent } from "react"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { graphql } from "@/generated"
import { TodosDocument } from "@/generated/graphql"

const CreateTodoDocument = graphql(`
  mutation CreateTodo($input: NewTodo!) {
    createTodo(input: $input) {
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

export function CreateTodo() {
  const [text, setText] = useState("")
  const [createTodo, { loading }] = useMutation(CreateTodoDocument, {
    refetchQueries: [TodosDocument],
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    await createTodo({
      variables: { input: { text: trimmed } },
    })
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New todo..."
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !text.trim()}>
        {loading ? "Creating..." : "Create"}
      </Button>
    </form>
  )
}
