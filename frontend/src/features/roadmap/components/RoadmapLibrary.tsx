import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { CreateRoadmap } from "./CreateRoadmap"

type RoadmapItem = {
  id: string
  title: string
}

type RoadmapLibraryProps = {
  roadmaps: RoadmapItem[]
  loading: boolean
  error?: Error
  selectedId: string | null
  onSelect: (roadmapId: string) => void
}

export function RoadmapLibrary({
  roadmaps,
  loading,
  error,
  selectedId,
  onSelect,
}: RoadmapLibraryProps) {
  useEffect(() => {
    if (roadmaps.length > 0 && selectedId === null) {
      onSelect(roadmaps[0].id)
    }
  }, [roadmaps, selectedId, onSelect])

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-4 border-r pr-4">
      <h2 className="text-sm font-semibold">ライブラリ</h2>
      <CreateRoadmap onCreated={onSelect} />
      <div className="flex flex-col gap-1">
        {loading ? (
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        ) : error ? (
          <p className="text-sm text-destructive">読み込みに失敗しました</p>
        ) : roadmaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            ロードマップがありません
          </p>
        ) : (
          roadmaps.map((roadmap) => (
            <button
              key={roadmap.id}
              type="button"
              onClick={() => onSelect(roadmap.id)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm transition-colors",
                selectedId === roadmap.id
                  ? "bg-accent font-medium text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              {roadmap.title}
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
