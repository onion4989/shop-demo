export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import {
  isPerfProbeAllowed,
  parsePerfTarget,
  runPerfTarget,
} from '@lib/server/perfProbe'

function parseLimit(raw: string | null): number | null {
  if (raw === null || raw === '' || raw === 'all') return null
  const num = Number(raw)
  if (!Number.isFinite(num) || num < 1) return null
  return Math.min(100, Math.floor(num))
}

function parsePage(raw: string | null): number {
  const num = parseInt(raw || '1', 10)
  return Number.isFinite(num) && num >= 1 ? num : 1
}

export async function GET(req: Request) {
  if (!isPerfProbeAllowed()) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const target = parsePerfTarget(searchParams.get('target'))
  if (!target) {
    return NextResponse.json(
      {
        error: 'invalid target',
        targets: [
          'home-hero',
          'home-gift',
          'home-items',
          'top-products',
          'product-detail',
          'cart-catalog',
          'catalog-list',
        ],
      },
      { status: 400 },
    )
  }

  const productId = searchParams.get('productId') ?? undefined
  const page = parsePage(searchParams.get('page'))
  const limit = parseLimit(searchParams.get('limit'))

  if (target === 'product-detail' && !productId) {
    return NextResponse.json(
      { error: 'productId required' },
      { status: 400 },
    )
  }

  const result = await runPerfTarget(target, { productId, page, limit })
  return NextResponse.json(result)
}
