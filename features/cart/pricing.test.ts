import { describe, expect, it } from 'vitest'
import type { CartCatalogItem, CartLine } from '@features/cart/types'
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  buildCartSummary,
  fulfillmentOf,
  isDeliveryProductId,
} from '@features/cart/pricing'

function item(
  partial: Partial<CartCatalogItem> &
    Pick<CartCatalogItem, 'productId' | 'categoryId' | 'price'>,
): CartCatalogItem {
  return {
    name: partial.name ?? partial.productId,
    thumbnailUrl: partial.thumbnailUrl ?? '/x.png',
    categoryName: partial.categoryName ?? 'Category',
    shippingAvailable: partial.shippingAvailable ?? true,
    ...partial,
  }
}

function catalogOf(...items: CartCatalogItem[]) {
  return new Map(items.map((entry) => [entry.productId, entry]))
}

describe('fulfillmentOf', () => {
  it('marks CUP and TAR as delivery', () => {
    expect(
      fulfillmentOf(item({ productId: 'CUP001', categoryId: 'CUP', price: 1000 })),
    ).toBe('delivery')
    expect(
      fulfillmentOf(item({ productId: 'TAR001', categoryId: 'TAR', price: 1000 })),
    ).toBe('delivery')
  })

  it('marks ICE as pickup', () => {
    expect(
      fulfillmentOf(
        item({
          productId: 'ICE001',
          categoryId: 'ICE',
          price: 1000,
          shippingAvailable: true,
        }),
      ),
    ).toBe('pickup')
  })
})

describe('isDeliveryProductId', () => {
  it('uses category prefix and 配送可 tag', () => {
    expect(isDeliveryProductId('CUP001', [])).toBe(true)
    expect(isDeliveryProductId('ICE001', ['配送可'])).toBe(false)
    expect(isDeliveryProductId('GIF001', ['配送可'])).toBe(true)
    expect(isDeliveryProductId('GIF001', [])).toBe(false)
  })
})

describe('buildCartSummary', () => {
  const cup = item({
    productId: 'CUP001',
    categoryId: 'CUP',
    categoryName: 'カップケーキ',
    name: 'いちごカップケーキ',
    price: 2000,
  })
  const ice = item({
    productId: 'ICE001',
    categoryId: 'ICE',
    categoryName: 'アイスケーキ',
    name: 'バニラアイスケーキ',
    price: 3000,
    shippingAvailable: false,
  })

  it('returns empty summary for no lines', () => {
    const summary = buildCartSummary([], catalogOf(cup))
    expect(summary.isEmpty).toBe(true)
    expect(summary.shippingFee).toBe(0)
    expect(summary.total).toBe(0)
  })

  it('charges shipping under free threshold for delivery items', () => {
    const lines: CartLine[] = [{ productId: 'CUP001', qty: 2 }]
    const summary = buildCartSummary(lines, catalogOf(cup))
    expect(summary.deliverySubtotal).toBe(4000)
    expect(summary.freeShipping).toBe(false)
    expect(summary.shippingFee).toBe(SHIPPING_FEE)
    expect(summary.remaining).toBe(FREE_SHIPPING_THRESHOLD - 4000)
    expect(summary.total).toBe(4000 + SHIPPING_FEE)
  })

  it('waives shipping at free threshold', () => {
    const lines: CartLine[] = [{ productId: 'CUP001', qty: 3 }]
    const summary = buildCartSummary(lines, catalogOf(cup))
    expect(summary.deliverySubtotal).toBe(6000)
    expect(summary.freeShipping).toBe(true)
    expect(summary.shippingFee).toBe(0)
    expect(summary.remaining).toBe(0)
    expect(summary.progress).toBe(1)
    expect(summary.total).toBe(6000)
  })

  it('hides shipping for pickup-only cart', () => {
    const lines: CartLine[] = [{ productId: 'ICE001', qty: 2 }]
    const summary = buildCartSummary(lines, catalogOf(ice))
    expect(summary.hasDelivery).toBe(false)
    expect(summary.hasPickup).toBe(true)
    expect(summary.shippingFee).toBe(0)
    expect(summary.progress).toBe(0)
    expect(summary.total).toBe(6000)
  })

  it('caps qty at MAX_QTY', () => {
    const lines: CartLine[] = [{ productId: 'CUP001', qty: 9 }]
    const summary = buildCartSummary(lines, catalogOf(cup))
    expect(summary.totalCount).toBe(5)
    expect(summary.itemsSubtotal).toBe(10000)
  })
})
