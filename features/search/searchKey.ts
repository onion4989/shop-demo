/** catalog /api/search の1ページ件数 */
export const CATALOG_PAGE_SIZE = 30

export type SearchKeyInput = {
  query?: string
  category?: string
  price?: string
  options?: string
  page?: number
  limit?: number
}

function norm(v: string | undefined | null) {
  return v && v !== 'undefined' && v !== 'null' ? v : ''
}

/** SWR キーと API クエリを揃える（page / limit は常に付与） */
export function buildSearchKey(input: SearchKeyInput = {}): string {
  const page = Math.max(1, input.page ?? 1)
  const limit = input.limit ?? CATALOG_PAGE_SIZE
  const sp = new URLSearchParams()
  const query = norm(input.query)
  const category = norm(input.category)
  const price = norm(input.price)
  const options = norm(input.options)
  if (query) sp.set('query', query)
  if (category) sp.set('category', category)
  if (price) sp.set('price', price)
  if (options) sp.set('options', options)
  sp.set('page', String(page))
  sp.set('limit', String(limit))
  return `/api/search?${sp.toString()}`
}
