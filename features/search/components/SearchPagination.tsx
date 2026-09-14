'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CATALOG_PAGE_SIZE } from '@features/search/searchKey'

export default function SearchPagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  if (totalPages <= 1) return null

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams)
    if (nextPage <= 1) params.delete('page')
    else params.set('page', String(nextPage))
    if (!params.get('limit')) params.set('limit', String(CATALOG_PAGE_SIZE))
    const qs = params.toString()
    replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-4"
      aria-label="検索結果のページ"
    >
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        前へ
      </button>
      <span className="text-sm text-gray-700">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
      >
        次へ
      </button>
    </nav>
  )
}
