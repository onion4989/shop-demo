// features/search/components/ClientSearch.tsx
'use client'

import SearchFroms from '@features/search/components/SearchForm'
import HitNumber from '@features/search/components/SearchHit'
import SearchPagination from '@features/search/components/SearchPagination'
import ResultsTable from '@features/search/components/SearchResults'
import {
  buildSearchKey,
  CATALOG_PAGE_SIZE,
} from '@features/search/searchKey'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

type Product = {
  productId: string
  name: string
  category: { name: string }
  images: { thumbnailUrl: string }[]
  price: number
  option?: unknown
}

type ApiResponse = {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const norm = (v: string | null) =>
  v && v !== 'undefined' && v !== 'null' ? v : ''

export default function ClientSearch() {
  const params = useSearchParams()

  const query = norm(params.get('query'))
  const category = norm(params.get('category'))
  const price = norm(params.get('price'))
  const options = norm(params.get('options'))
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1)
  const limit = CATALOG_PAGE_SIZE

  const key = buildSearchKey({
    query,
    category,
    price,
    options,
    page,
    limit,
  })

  const { data } = useSWR<ApiResponse>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  const total = data?.total ?? 0
  const totalPages =
    data?.totalPages ?? Math.max(1, Math.ceil(total / limit))
  const currentPage = data?.page ?? page

  return (
    <>
      <div className="my-24 grid grid-cols-12 gap-6">
        <div className="col-span-10 grid grid-cols-4 gap-4">
          <SearchFroms />
        </div>
        <div className="col-span-2">
          <HitNumber max={total} search={data?.products?.length || 0} />
        </div>
      </div>
      <div>
        <ResultsTable result={data?.products || []} />
        <SearchPagination page={currentPage} totalPages={totalPages} />
      </div>
    </>
  )
}
