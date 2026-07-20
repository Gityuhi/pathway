import { graphql } from "@/generated"

export const RoadmapNodesDocument = graphql(`
  query RoadmapNodes($roadmapId: ID!) {
    roadmapNodes(roadmapId: $roadmapId) {
      id
      roadmapId
      parentId
      title
    }
  }
`)
