import { cn } from '@/lib/utils'

export function CategoryTag({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-[10px] bg-[#E4C1DB] px-2 text-[11px] font-bold leading-none text-black',
        className,
      )}
    >
      {name}
    </span>
  )
}
