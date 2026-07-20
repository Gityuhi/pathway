import { useMemo } from "react"
import { ReactFlow, Background, Controls, type Node, type NodeProps } from "@xyflow/react"
import { Card, CardTitle } from "@/components/ui/card"
import type { RoadmapNodeData, RoadmapNodeItem } from "@/features/roadmap/lib/layout"
import { layoutRoadmapNodes } from "@/features/roadmap/lib/layout"
import { useQuery } from "@apollo/client/react"
import { RoadmapNodesDocument } from "../graphql/roadmapNodes"
import type { RoadmapNodesQuery, RoadmapNodesQueryVariables } from "@/generated/graphql"

import "@xyflow/react/dist/style.css"

type RoadmapNode = Node<RoadmapNodeData, "roadmapNode">

function RoadmapNodeCard({ data }: NodeProps<RoadmapNode>) {
  return (
    <Card className="w-[220px] bg-card/80 shadow-none ring-foreground/10">
      <div className="px-4 py-3">
        <CardTitle className="text-sm">{data.title}</CardTitle>
      </div>
    </Card>
  )
}

const nodeTypes = {
  roadmapNode: RoadmapNodeCard,
}

type RoadmapCanvasProps = {
  roadmapId: string | null
}

export function RoadmapCanvas({ roadmapId }: RoadmapCanvasProps) {
  const { data, loading } = useQuery<
    RoadmapNodesQuery,
    RoadmapNodesQueryVariables
  >(RoadmapNodesDocument as any, {
    variables: { roadmapId: roadmapId as string | number },
    skip: !roadmapId,
  })

  const items: RoadmapNodeItem[] = useMemo(() => {
    const nodes = data?.roadmapNodes ?? []
    return nodes.map((n) => ({
      id: n.id,
      title: n.title,
      parentId: n.parentId,
    }))
  }, [data])

  const { nodes, edges } = useMemo(() => {
    return layoutRoadmapNodes(items)
  }, [items])

  if (!roadmapId) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        ロードマップを選択してください
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        key={roadmapId}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
      >
        <Background gap={24} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
