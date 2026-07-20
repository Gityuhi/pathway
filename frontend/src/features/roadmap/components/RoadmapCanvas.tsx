import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
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
  UpdateRoadmapNodeDocument,
} from "../graphql/roadmapMutations"
import type {
  CreateRoadmapNodeMutation,
  CreateRoadmapNodeMutationVariables,
  DeleteRoadmapNodeMutation,
  DeleteRoadmapNodeMutationVariables,
  RoadmapNodesQuery,
  RoadmapNodesQueryVariables,
  UpdateRoadmapNodeMutation,
  UpdateRoadmapNodeMutationVariables,
} from "@/generated/graphql"

import "@xyflow/react/dist/style.css"

const DEFAULT_NODE_TITLE = "新規ノード"

type RoadmapNode = Node<RoadmapNodeData, "roadmapNode">

function RoadmapNodeCard({ data, selected }: NodeProps<RoadmapNode>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(data.title)

  useEffect(() => {
    setDraft(data.title)
  }, [data.title])

  useEffect(() => {
    if (!data.isEditing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [data.isEditing])

  if (data.isEditing) {
    return (
      <div className="w-[220px] rounded-lg border-2 border-blue-500 bg-white px-2 py-2 shadow-sm">
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !border-zinc-300 !bg-zinc-400"
        />
        <input
          ref={inputRef}
          className="nodrag nopan w-full rounded border border-zinc-200 bg-white px-2 py-1 text-sm font-medium text-zinc-900 outline-none focus:border-blue-500"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => data.onCommitEdit?.(draft)}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === "Enter") {
              e.preventDefault()
              data.onCommitEdit?.(draft)
            }
            if (e.key === "Escape") {
              e.preventDefault()
              data.onCancelEdit?.()
            }
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!h-2.5 !w-2.5 !border-zinc-300 !bg-zinc-400"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "w-[220px] rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm",
        selected && "border-2 border-blue-500"
      )}
      onDoubleClick={(e) => {
        e.stopPropagation()
        data.onStartEdit?.()
      }}
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
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)

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

  const [updateRoadmapNode, { loading: updating }] = useMutation<
    UpdateRoadmapNodeMutation,
    UpdateRoadmapNodeMutationVariables
  >(UpdateRoadmapNodeDocument as any)

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
    setEditingNodeId(null)
  }, [roadmapId])

  useEffect(() => {
    if (items.length === 0) {
      setFocusedNodeId(null)
      setEditingNodeId(null)
      return
    }

    if (focusedNodeId === null) {
      setFocusedNodeId(getDefaultFocusNodeId(items))
      return
    }

    if (!items.some((item) => item.id === focusedNodeId)) {
      setFocusedNodeId(getDefaultFocusNodeId(items))
    }

    if (editingNodeId && !items.some((item) => item.id === editingNodeId)) {
      setEditingNodeId(null)
    }
  }, [items, focusedNodeId, editingNodeId])

  const handleStartEdit = useCallback((nodeId: string) => {
    setFocusedNodeId(nodeId)
    setEditingNodeId(nodeId)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingNodeId(null)
    containerRef.current?.focus()
  }, [])

  const handleCommitEdit = useCallback(
    async (nodeId: string, title: string) => {
      if (updating) return

      const current = items.find((item) => item.id === nodeId)
      const trimmed = title.trim()
      if (!trimmed || !current || trimmed === current.title) {
        setEditingNodeId(null)
        containerRef.current?.focus()
        return
      }

      await updateRoadmapNode({
        variables: {
          id: nodeId,
          input: { title: trimmed },
        },
        refetchQueries: [
          { query: RoadmapNodesDocument as any, variables: queryVariables },
        ],
      })
      setEditingNodeId(null)
      containerRef.current?.focus()
    },
    [items, updating, updateRoadmapNode, queryVariables]
  )

  const { nodes, edges } = useMemo(() => {
    const layout = layoutRoadmapNodes(items)
    return {
      nodes: layout.nodes.map((node) => ({
        ...node,
        selected: node.id === focusedNodeId,
        data: {
          title: node.data.title,
          isEditing: node.id === editingNodeId,
          onStartEdit: () => handleStartEdit(node.id),
          onCommitEdit: (title: string) => {
            void handleCommitEdit(node.id, title)
          },
          onCancelEdit: handleCancelEdit,
        },
      })),
      edges: layout.edges,
    }
  }, [
    items,
    focusedNodeId,
    editingNodeId,
    handleStartEdit,
    handleCommitEdit,
    handleCancelEdit,
  ])

  const handleCreateChild = useCallback(async () => {
    if (!roadmapId || !focusedNodeId || creating || editingNodeId) return

    const result = await createRoadmapNode({
      variables: {
        input: {
          roadmapId,
          parentId: focusedNodeId,
          title: DEFAULT_NODE_TITLE,
        },
      },
      refetchQueries: [
        { query: RoadmapNodesDocument as any, variables: queryVariables },
      ],
    })

    const newNodeId = result.data?.createRoadmapNode.id
    if (newNodeId) {
      setFocusedNodeId(newNodeId)
      setEditingNodeId(newNodeId)
    }
  }, [
    roadmapId,
    focusedNodeId,
    creating,
    editingNodeId,
    createRoadmapNode,
    queryVariables,
  ])

  const handleDeleteNode = useCallback(async () => {
    if (!roadmapId || !focusedNodeId || deleting || editingNodeId) return

    const nextFocusId = getFocusAfterDelete(items, focusedNodeId)
    setFocusedNodeId(nextFocusId)
    setEditingNodeId(null)

    await deleteRoadmapNode({
      variables: { id: focusedNodeId },
      refetchQueries: [
        { query: RoadmapNodesDocument as any, variables: queryVariables },
      ],
    })
  }, [
    roadmapId,
    focusedNodeId,
    deleting,
    editingNodeId,
    items,
    deleteRoadmapNode,
    queryVariables,
  ])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (isEditableTarget(event.target) || editingNodeId) return

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
    [focusedNodeId, items, editingNodeId, handleCreateChild, handleDeleteNode]
  )

  const handleNodeClick = useCallback(
    (_event: ReactMouseEvent, node: Node) => {
      if (editingNodeId) return
      setFocusedNodeId(node.id)
      containerRef.current?.focus()
    },
    [editingNodeId]
  )

  const handlePaneClick = useCallback(() => {
    if (editingNodeId) return
    containerRef.current?.focus()
  }, [editingNodeId])

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
