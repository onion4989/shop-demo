type Closer = () => void

const closers = new Set<Closer>()

export function addExpandCloser(close: Closer) {
  closers.add(close)
}

export function removeExpandCloser(close: Closer) {
  closers.delete(close)
}

export function closeExpandDialogs() {
  closers.forEach((close) => close())
}
