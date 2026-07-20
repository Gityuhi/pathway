import { useState, type FormEvent } from "react"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { graphql } from "@/generated"
import { RoadmapsDocument } from "../graphql/roadmaps"

const CreateRoadmapDocument = graphql(`
  mutation CreateRoadmap($input: NewRoadmap!) {
    createRoadmap(input: $input) {
      id
      title
      createdAt
    }
  }
`)

type CreateRoadmapProps = {
  onCreated: (roadmapId: string) => void
}

export function CreateRoadmap({ onCreated }: CreateRoadmapProps) {
  const [title, setTitle] = useState("")
  const [createRoadmap, { loading }] = useMutation(CreateRoadmapDocument, {
    refetchQueries: [RoadmapsDocument],
    onCompleted: (data) => {
      onCreated(data.createRoadmap.id)
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    await createRoadmap({
      variables: { input: { title: trimmed } },
    })
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新規ロードマップ..."
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !title.trim()}>
        {loading ? "作成中..." : "作成"}
      </Button>
    </form>
  )
}
