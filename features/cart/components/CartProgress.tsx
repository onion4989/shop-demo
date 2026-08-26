import { cn } from '@lib/utils'

type CartProgressProps = {
  freeShipping: boolean
  remaining: number
  progress: number
  compact?: boolean
}

export function CartProgress({
  freeShipping,
  remaining,
  progress,
  compact = false,
}: CartProgressProps) {
  return (
    <div className={cn('w-full', compact ? 'space-y-1.5' : 'space-y-2.5')}>
      {freeShipping ? (
        <p
          className={cn(
            'text-center font-bold text-white',
            compact ? 'text-[12px]' : 'text-[16px]',
          )}
        >
          送料無料です
        </p>
      ) : compact ? (
        <div className="flex flex-col items-center gap-0.5 text-white">
          <p className="text-[12px]">送料無料まであと</p>
          <p className="text-[20px] font-bold leading-none">
            {remaining.toLocaleString('ja-JP')}
            <span className="text-[12px] font-normal">円</span>
          </p>
        </div>
      ) : (
        <p
          className={cn(
            'flex items-baseline justify-center gap-1 text-white',
            compact ? 'text-[12px]' : 'text-[14px]',
          )}
        >
          送料無料まであと
          <span className={compact ? 'text-[20px] font-bold' : 'text-[24px] font-bold'}>
            {remaining.toLocaleString('ja-JP')}
          </span>
          円
        </p>
      )}

      <div className="h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-[#72BFA3] transition-[width] duration-300"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
