import { graphql } from "@/generated"

export const CreateRoadmapNodeDocument = graphql(`
  mutation CreateRoadmapNode($input: NewRoadmapNode!) {
    createRoadmapNode(input: $input) {
      id
      roadmapId
      parentId
      title
    }
  }
`)

export const DeleteRoadmapNodeDocument = graphql(`
  mutation DeleteRoadmapNode($id: ID!) {
    deleteRoadmapNode(id: $id) {
      id
    }
  }
`)
