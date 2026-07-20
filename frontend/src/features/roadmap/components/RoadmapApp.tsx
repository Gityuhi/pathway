import { useCallback, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { RoadmapLibrary } from "./RoadmapLibrary"
import { RoadmapsDocument } from "../graphql/roadmaps"
import { RoadmapCanvas } from "./RoadmapCanvas"

export function RoadmapApp() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null)
  const { data, loading, error } = useQuery(RoadmapsDocument)
  const roadmaps = data?.roadmaps ?? []

  const handleSelect = useCallback((roadmapId: string) => {
    setSelectedRoadmapId(roadmapId)
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <RoadmapLibrary
        roadmaps={roadmaps}
        loading={loading}
        error={error}
        selectedId={selectedRoadmapId}
        onSelect={handleSelect}
      />
      <div className="flex flex-1 overflow-hidden rounded-lg border border-dashed bg-muted/30">
        <RoadmapCanvas roadmapId={selectedRoadmapId} />
      </div>
    </div>
  )
}
