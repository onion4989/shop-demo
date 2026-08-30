import { flavorDisplayName } from '@features/catalog/flavorDisplayName'
import type { CartCatalogItem, CartLine } from '@features/cart/types'

export const SHIPPING_FEE = 500
export const FREE_SHIPPING_THRESHOLD = 5000
export const MAX_QTY = 5

const DELIVERY_ONLY_CATEGORIES = ['CUP', 'TAR']
const PICKUP_ONLY_CATEGORIES = ['ICE']
const GROUP_ORDER = ['CUP', 'TAR', 'GIF', 'ICE']

export type Fulfillment = 'delivery' | 'pickup'

export type CartRowData = {
  productId: string
  name: string
  price: number
  thumbnailUrl: string
  qty: number
  subtotal: number
}

export type CartGroup = {
  categoryId: string
  categoryName: string
  fulfillment: Fulfillment
  rows: CartRowData[]
  subtotal: number
}

export type CartSummary = {
  groups: CartGroup[]
  isEmpty: boolean
  hasDelivery: boolean
  hasPickup: boolean
  deliverySubtotal: number
  itemsSubtotal: number
  shippingFee: number
  freeShipping: boolean
  remaining: number
  progress: number
  totalCount: number
  total: number
}

export function formatYen(value: number) {
  return `￥${Math.round(value).toLocaleString('ja-JP')}`
}

export function fulfillmentOf(item: CartCatalogItem): Fulfillment {
  if (PICKUP_ONLY_CATEGORIES.includes(item.categoryId)) return 'pickup'
  if (DELIVERY_ONLY_CATEGORIES.includes(item.categoryId)) return 'delivery'
  return item.shippingAvailable ? 'delivery' : 'pickup'
}

export function linesHadDelivery(
  lines: CartLine[],
  catalog: Map<string, CartCatalogItem>,
): boolean {
  return lines.some((line) => {
    const item = catalog.get(line.productId)
    return item != null && fulfillmentOf(item) === 'delivery'
  })
}

/** ExpandableProductDialog などカタログ外から addItem するときの配送判定 */
export function isDeliveryProductId(productId: string, tags: string[]): boolean {
  const categoryId = productId.slice(0, 3)
  if (PICKUP_ONLY_CATEGORIES.includes(categoryId)) return false
  if (DELIVERY_ONLY_CATEGORIES.includes(categoryId)) return true
  return tags.includes('配送可')
}

function groupRank(group: CartGroup) {
  const fulfillmentRank = group.fulfillment === 'delivery' ? 0 : 1
  const orderIndex = GROUP_ORDER.indexOf(group.categoryId)
  return [fulfillmentRank, orderIndex < 0 ? GROUP_ORDER.length : orderIndex]
}

export function buildCartSummary(
  lines: CartLine[],
  catalog: Map<string, CartCatalogItem>,
): CartSummary {
  const groupsById = new Map<string, CartGroup>()

  for (const line of lines) {
    const item = catalog.get(line.productId)
    if (!item || line.qty < 1) continue

    const qty = Math.min(line.qty, MAX_QTY)
    const row: CartRowData = {
      productId: item.productId,
      name: flavorDisplayName(item.name),
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      qty,
      subtotal: item.price * qty,
    }

    const existing = groupsById.get(item.categoryId)
    if (existing) {
      existing.rows.push(row)
      existing.subtotal += row.subtotal
      continue
    }

    groupsById.set(item.categoryId, {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      fulfillment: fulfillmentOf(item),
      rows: [row],
      subtotal: row.subtotal,
    })
  }

  const groups = [...groupsById.values()].sort((a, b) => {
    const [aFulfillment, aOrder] = groupRank(a)
    const [bFulfillment, bOrder] = groupRank(b)
    return aFulfillment - bFulfillment || aOrder - bOrder
  })

  const deliveryGroups = groups.filter((group) => group.fulfillment === 'delivery')
  const deliverySubtotal = deliveryGroups.reduce((sum, group) => sum + group.subtotal, 0)
  const itemsSubtotal = groups.reduce((sum, group) => sum + group.subtotal, 0)
  const totalCount = groups.reduce(
    (count, group) => count + group.rows.reduce((rows, row) => rows + row.qty, 0),
    0,
  )

  const hasDelivery = deliveryGroups.length > 0
  const freeShipping = hasDelivery && deliverySubtotal >= FREE_SHIPPING_THRESHOLD
  const shippingFee = hasDelivery && !freeShipping ? SHIPPING_FEE : 0

  return {
    groups,
    isEmpty: groups.length === 0,
    hasDelivery,
    hasPickup: groups.some((group) => group.fulfillment === 'pickup'),
    deliverySubtotal,
    itemsSubtotal,
    shippingFee,
    freeShipping,
    remaining: Math.max(0, FREE_SHIPPING_THRESHOLD - deliverySubtotal),
    progress: hasDelivery
      ? Math.min(1, deliverySubtotal / FREE_SHIPPING_THRESHOLD)
      : 0,
    totalCount,
    total: itemsSubtotal + shippingFee,
  }
}
