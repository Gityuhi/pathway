import dagre from "@dagrejs/dagre"
import type { Edge, Node } from "@xyflow/react"

export type RoadmapNodeData = {
  title: string
}

export type RoadmapNodeItem = {
  id: string
  title: string
  parentId: string | null
}

const NODE_WIDTH = 220
const NODE_HEIGHT = 56

export function layoutRoadmapNodes(items: RoadmapNodeItem[]) {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: "LR",
    nodesep: 40,
    ranksep: 90,
  })

  const ids = new Set(items.map((n) => n.id))

  items.forEach((n) => {
    graph.setNode(n.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })
  })

  items.forEach((child) => {
    if (!child.parentId) return
    if (!ids.has(child.parentId)) return
    graph.setEdge(child.parentId, child.id)
  })

  dagre.layout(graph)

  const rfNodes: Node<RoadmapNodeData>[] = items.map((n) => {
    const pos = graph.node(n.id) as { x: number; y: number } | undefined
    const x = (pos?.x ?? 0) - NODE_WIDTH / 2
    const y = (pos?.y ?? 0) - NODE_HEIGHT / 2

    return {
      id: n.id,
      type: "roadmapNode",
      position: { x, y },
      data: { title: n.title },
      draggable: false,
      selectable: true,
    }
  })

  const rfEdges: Edge[] = items.flatMap((child) => {
    if (!child.parentId) return []
    if (!ids.has(child.parentId)) return []
    return [
      {
        id: `e-${child.parentId}-${child.id}`,
        source: child.parentId,
        target: child.id,
      },
    ]
  })

  return { nodes: rfNodes, edges: rfEdges }
}
