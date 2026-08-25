const NAME_SUFFIXES = [
  'カップケーキ',
  'アイスケーキ',
  'タルトケーキ',
  'アイス',
] as const

export function flavorDisplayName(name: string) {
  for (const suffix of NAME_SUFFIXES) {
    if (name.endsWith(suffix) && name.length > suffix.length) {
      return name.slice(0, -suffix.length)
    }
  }
  return name
}
