// app/(main)/catalog/page.tsx
import {
  buildSearchKey,
  CATALOG_PAGE_SIZE,
} from '@features/search/searchKey'
import { prisma } from '@/lib/server/prisma'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'

const ClientSearch = dynamic(
  () => import('@features/search/components/ClientSearch'),
)

function parsePage(raw: string | string[] | undefined) {
  const v = Array.isArray(raw) ? raw[0] : raw
  const num = parseInt(v || '1', 10)
  return Number.isFinite(num) && num >= 1 ? num : 1
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const page = parsePage(sp.page)
  const limit = CATALOG_PAGE_SIZE
  const skip = (page - 1) * limit

  // 初回 SSR はフィルタなし・page/limit のみ（フィルタ時は SWR が API 取得）
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
      take: limit,
      skip,
    }),
    prisma.product.count(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const initialKey = buildSearchKey({ page, limit })
  const initialData = {
    products,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }

  return (
    <main className="m-auto w-full lg:w-[1200px]">
      <section className="my-24">
        <SWRConfig value={{ fallback: { [initialKey]: initialData } }}>
          <Suspense fallback={<div>読み込み中...</div>}>
            <ClientSearch />
          </Suspense>
        </SWRConfig>
      </section>
    </main>
  )
}
