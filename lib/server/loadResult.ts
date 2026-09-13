export type LoadFail = {
  ok: false
  reason: 'unavailable'
}

export type LoadOk<T> = {
  ok: true
  data: T
}

export type LoadResult<T> = LoadOk<T> | LoadFail
