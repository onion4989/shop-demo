'use client'

import {
  CartCheckoutSchema,
  type CartCheckoutValues,
} from '@features/cart/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaArrowUp } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

export const CART_CHECKOUT_FORM_ID = 'cart-checkout-form'

const FIELDS = [
  {
    name: 'name' as const,
    id: 'cart-name',
    label: 'お名前',
    type: 'text',
    defaultValue: 'テスト太郎',
    placeholder: '山田 太郎',
  },
  {
    name: 'address' as const,
    id: 'cart-address',
    label: '住所',
    type: 'text',
    defaultValue: 'テスト県テスト市テスト町1-1-2',
    placeholder: '東京都千代田区大手町 1-1-1',
  },
  {
    name: 'email' as const,
    id: 'cart-email',
    label: 'メールアドレス',
    type: 'email',
    defaultValue: 'test@test-mail.com',
    placeholder: 'example@domain.com',
  },
] as const

function RequiredBadge() {
  return (
    <span className="inline-flex h-4 w-[34px] shrink-0 items-center justify-center rounded-[2px] bg-[#EFEA44] text-[10px] font-black text-black">
      必須
    </span>
  )
}

export function CartCheckoutForm({
  onBack,
  onConfirm,
  disabled,
}: {
  onBack: () => void
  onConfirm: () => void
  disabled: boolean
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CartCheckoutValues>({
    resolver: zodResolver(CartCheckoutSchema),
    defaultValues: {
      name: FIELDS[0].defaultValue,
      address: FIELDS[1].defaultValue,
      email: FIELDS[2].defaultValue,
    },
  })

  return (
    <section className="space-y-3 border-t border-dashed border-white/40 pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-bold text-white">
          ユーザー情報のご入力
        </h3>
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="flex cursor-pointer items-center gap-1 text-[12px] text-white underline transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaArrowUp className="size-2.5" aria-hidden />
          前に戻る
        </button>
      </div>

      <form
        id={CART_CHECKOUT_FORM_ID}
        noValidate
        onSubmit={handleSubmit(onConfirm)}
        className="space-y-2.5"
      >
        {FIELDS.map((field) => (
          <div key={field.id} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={field.id}
                className="text-[12px] font-bold text-white"
              >
                {field.label}
              </label>
              <RequiredBadge />
            </div>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              disabled={disabled}
              className="h-9 w-full rounded-[5px] bg-white px-2.5 text-[13px] text-black disabled:opacity-60"
              {...register(field.name)}
            />
            {errors[field.name] ? (
              <p className="text-[10px] text-[#EFEA44]">
                {errors[field.name]?.message}
              </p>
            ) : null}
          </div>
        ))}
      </form>
    </section>
  )
}
