import {
  getProductDetailCached,
  getTopProducts,
} from '@features/catalog/Loaders'
import { getCartCatalog } from '@features/cart/Loaders'
import {
  getHomeGiftProducts,
  getHomeHeroProducts,
  getHomeItemsProducts,
} from '@features/home/Loaders'
import { prisma } from '@lib/server/prisma'

export const PERF_TARGETS = [
  'home-hero',
  'home-gift',
  'home-items',
  'top-products',
  'product-detail',
  'cart-catalog',
  'catalog-list',
] as const

export type PerfTarget = (typeof PERF_TARGETS)[number]

export type PerfRunResult = {
  target: PerfTarget
  ms: number
  ok: boolean
  meta?: Record<string, number | string | boolean>
}

function isPerfTarget(value: string): value is PerfTarget {
  return (PERF_TARGETS as readonly string[]).includes(value)
}

export function parsePerfTarget(value: string | null): PerfTarget | null {
  if (!value) return null
  return isPerfTarget(value) ? value : null
}

/** production では PERF_PROBE=1 のときだけ許可 */
export function isPerfProbeAllowed(): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  return process.env.PERF_PROBE === '1'
}

async function runCatalogList(page: number, limit: number | null) {
  const skip = limit ? (page - 1) * limit : 0
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      orderBy: { recommend: 'asc' },
      select: {
        productId: true,
        name: true,
        price: true,
        category: { select: { name: true } },
        images: { select: { thumbnailUrl: true } },
        option: true,
      },
      ...(limit ? { take: limit, skip } : {}),
    }),
    prisma.product.count(),
  ])
  return { count: products.length, total, page, limit: limit ?? 'all' }
}

export async function runPerfTarget(
  target: PerfTarget,
  opts: { productId?: string; page?: number; limit?: number | null },
): Promise<PerfRunResult> {
  const started = performance.now()
  let ok = true
  let meta: PerfRunResult['meta']

  try {
    switch (target) {
      case 'home-hero': {
        const result = await getHomeHeroProducts()
        ok = result.ok
        meta = { rows: result.ok ? result.data.length : 0 }
        break
      }
      case 'home-gift': {
        const result = await getHomeGiftProducts()
        ok = result.ok
        meta = { rows: result.ok ? result.data.length : 0 }
        break
      }
      case 'home-items': {
        const result = await getHomeItemsProducts()
        ok = result.ok
        meta = { rows: result.ok ? result.data.length : 0 }
        break
      }
      case 'top-products': {
        const result = await getTopProducts(10)
        ok = result.ok
        meta = { rows: result.ok ? result.data.length : 0 }
        break
      }
      case 'product-detail': {
        const productId = opts.productId
        if (!productId) {
          return {
            target,
            ms: Math.round(performance.now() - started),
            ok: false,
            meta: { error: 'productId required' },
          }
        }
        // Phase 1 以降: 詳細+栄養を 1 ローダーで取得
        const detail = await getProductDetailCached(productId)
        ok = Boolean(detail)
        meta = {
          productId,
          hasDetail: Boolean(detail),
          hasNutri: Boolean(detail?.nutritionalInfo?.length),
        }
        break
      }
      case 'cart-catalog': {
        const items = await getCartCatalog()
        meta = { rows: items.length }
        break
      }
      case 'catalog-list': {
        const page = opts.page ?? 1
        const limit = opts.limit ?? null
        const listMeta = await runCatalogList(page, limit)
        meta = listMeta
        break
      }
    }
  } catch {
    ok = false
    meta = { ...(meta ?? {}), error: 'probe failed' }
  }

  return {
    target,
    ms: Math.round(performance.now() - started),
    ok,
    meta,
  }
}
