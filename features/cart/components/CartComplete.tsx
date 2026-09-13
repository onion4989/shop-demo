import { FaCheckCircle } from 'react-icons/fa'

export function CartComplete() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <FaCheckCircle className="size-16 text-white" aria-hidden />
      <p className="text-[16px] text-white">デモの購入フローが完了しました</p>

      <div className="w-full border-t border-dashed border-white/40" />

      <div className="space-y-2">
        <p className="text-[13px] text-white/80">
          このサイトでは注文の保存やメール送信は行っていません
        </p>
      </div>
    </div>
  )
}
