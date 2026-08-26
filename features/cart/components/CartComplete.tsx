import { MdOutlineMarkEmailRead } from 'react-icons/md'

export function CartComplete() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <MdOutlineMarkEmailRead className="size-16 text-white" aria-hidden />
      <p className="text-[16px] text-white">メールを送信しました。</p>

      <div className="w-full border-t border-dashed border-white/40" />

      <div className="space-y-2">
        <p className="text-[22px] font-bold text-white">注文は確定しました。</p>
        <p className="text-[13px] text-white/80">
          ご注文の詳細はメールをご確認ください。
        </p>
      </div>
    </div>
  )
}
