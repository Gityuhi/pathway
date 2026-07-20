import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import { cn } from "@/lib/utils"
import type { RoadmapNodeData, RoadmapNodeItem } from "@/features/roadmap/lib/layout"
import { layoutRoadmapNodes } from "@/features/roadmap/lib/layout"
import {
  getDefaultFocusNodeId,
  getFocusAfterDelete,
  getNextSiblingId,
} from "@/features/roadmap/lib/focus"
import { RoadmapNodesDocument } from "../graphql/roadmapNodes"
import {
  CreateRoadmapNodeDocument,
  DeleteRoadmapNodeDocument,
} from "../graphql/roadmapMutations"
import type {
  CreateRoadmapNodeMutation,
  CreateRoadmapNodeMutationVariables,
  DeleteRoadmapNodeMutation,
  DeleteRoadmapNodeMutationVariables,
  RoadmapNodesQuery,
  RoadmapNodesQueryVariables,
} from "@/generated/graphql"

import "@xyflow/react/dist/style.css"

const DEFAULT_NODE_TITLE = "新規ノード"

type RoadmapNode = Node<RoadmapNodeData, "roadmapNode">

function RoadmapNodeCard({ data, selected }: NodeProps<RoadmapNode>) {
  return (
    <div
      className={cn(
        "w-[220px] rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm",
        selected && "border-2 border-blue-500"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-zinc-300 !bg-zinc-400"
      />
      <span className="block truncate">{data.title}</span>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-zinc-300 !bg-zinc-400"
      />
    </div>
  )
}

const nodeTypes = {
  roadmapNode: RoadmapNodeCard,
}

type RoadmapCanvasProps = {
  roadmapId: string | null
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

export function RoadmapCanvas({ roadmapId }: RoadmapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)

  const queryVariables = useMemo(
    () => ({ roadmapId: roadmapId as string | number }),
    [roadmapId]
  )

  const { data, loading } = useQuery<
    RoadmapNodesQuery,
    RoadmapNodesQueryVariables
  >(RoadmapNodesDocument as any, {
    variables: queryVariables,
    skip: !roadmapId,
  })

  const [createRoadmapNode, { loading: creating }] = useMutation<
    CreateRoadmapNodeMutation,
    CreateRoadmapNodeMutationVariables
  >(CreateRoadmapNodeDocument as any)

  const [deleteRoadmapNode, { loading: deleting }] = useMutation<
    DeleteRoadmapNodeMutation,
    DeleteRoadmapNodeMutationVariables
  >(DeleteRoadmapNodeDocument as any)

  const items: RoadmapNodeItem[] = useMemo(() => {
    const nodes = data?.roadmapNodes ?? []
    return nodes.map((node) => ({
      id: node.id,
      title: node.title,
      parentId: node.parentId,
    }))
  }, [data])

  useEffect(() => {
    setFocusedNodeId(null)
  }, [roadmapId])

  useEffect(() => {
    if (items.length === 0) {
      setFocusedNodeId(null)
      return
    }

    if (focusedNodeId === null) {
      setFocusedNodeId(getDefaultFocusNodeId(items))
      return
    }

    if (!items.some((item) => item.id === focusedNodeId)) {
      setFocusedNodeId(getDefaultFocusNodeId(items))
    }
  }, [items, focusedNodeId])

  const { nodes, edges } = useMemo(() => {
    const layout = layoutRoadmapNodes(items)
    return {
      nodes: layout.nodes.map((node) => ({
        ...node,
        selected: node.id === focusedNodeId,
      })),
      edges: layout.edges,
    }
  }, [items, focusedNodeId])

  const handleCreateChild = useCallback(async () => {
    if (!roadmapId || !focusedNodeId || creating) return

    const result = await createRoadmapNode({
      variables: {
        input: {
          roadmapId,
          parentId: focusedNodeId,
          title: DEFAULT_NODE_TITLE,
        },
      },
      refetchQueries: [{ query: RoadmapNodesDocument as any, variables: queryVariables }],
    })

    const newNodeId = result.data?.createRoadmapNode.id
    if (newNodeId) {
      setFocusedNodeId(newNodeId)
    }
  }, [roadmapId, focusedNodeId, creating, createRoadmapNode, queryVariables])

  const handleDeleteNode = useCallback(async () => {
    if (!roadmapId || !focusedNodeId || deleting) return

    const nextFocusId = getFocusAfterDelete(items, focusedNodeId)
    setFocusedNodeId(nextFocusId)

    await deleteRoadmapNode({
      variables: { id: focusedNodeId },
      refetchQueries: [{ query: RoadmapNodesDocument as any, variables: queryVariables }],
    })
  }, [
    roadmapId,
    focusedNodeId,
    deleting,
    items,
    deleteRoadmapNode,
    queryVariables,
  ])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (isEditableTarget(event.target)) return

      if (event.key === "Enter") {
        event.preventDefault()
        void handleCreateChild()
        return
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault()
        void handleDeleteNode()
        return
      }

      if (event.key === "Tab") {
        event.preventDefault()
        if (!focusedNodeId) return
        const nextId = getNextSiblingId(items, focusedNodeId)
        if (nextId) setFocusedNodeId(nextId)
      }
    },
    [focusedNodeId, items, handleCreateChild, handleDeleteNode]
  )

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setFocusedNodeId(node.id)
      containerRef.current?.focus()
    },
    []
  )

  const handlePaneClick = useCallback(() => {
    containerRef.current?.focus()
  }, [])

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
    <div
      ref={containerRef}
      className="h-full w-full outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ReactFlow
        key={roadmapId}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
      >
        <Background gap={24} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
