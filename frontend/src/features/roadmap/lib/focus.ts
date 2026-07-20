import type { RoadmapNodeItem } from "./layout"

export function getDefaultFocusNodeId(items: RoadmapNodeItem[]): string | null {
  if (items.length === 0) return null
  const root = items.find((item) => item.parentId === null)
  return root?.id ?? items[0].id
}

export function getNextSiblingId(
  items: RoadmapNodeItem[],
  nodeId: string
): string | null {
  const current = items.find((item) => item.id === nodeId)
  if (!current) return null

  const siblings = items.filter((item) => item.parentId === current.parentId)
  if (siblings.length <= 1) return nodeId

  const index = siblings.findIndex((item) => item.id === nodeId)
  if (index === -1) return nodeId

  return siblings[(index + 1) % siblings.length].id
}

export function getFocusAfterDelete(
  items: RoadmapNodeItem[],
  deletedId: string
): string | null {
  const deleted = items.find((item) => item.id === deletedId)
  if (!deleted) return getDefaultFocusNodeId(items)

  const remaining = items.filter((item) => item.id !== deletedId)
  if (remaining.length === 0) return null

  if (deleted.parentId) {
    const parentStillExists = remaining.some(
      (item) => item.id === deleted.parentId
    )
    if (parentStillExists) return deleted.parentId
  }

  return getDefaultFocusNodeId(remaining)
}
