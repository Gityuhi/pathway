import { graphql } from "@/generated"

export const RoadmapsDocument = graphql(`
  query Roadmaps {
    roadmaps {
      id
      title
      createdAt
    }
  }
`)
