// app/(main)/catalog/page.tsx
import { prisma } from '@/lib/server/prisma'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'

// ここに元の dynamic import を移動します
const ClientSearch = dynamic(
  () => import('@features/search/components/ClientSearch')
)

export default async function Page() {
  // 初回は全件（= /api/search と同じ SELECT）を取得しておく
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
    }),
    prisma.product.count(),
  ])

  // SWR のキーとデータを一致させる（クエリなし=全件）
  const initialKey = '/api/search'
  const initialData = { products, total }

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
