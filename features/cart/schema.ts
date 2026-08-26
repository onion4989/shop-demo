import * as z from 'zod'

export const CartCheckoutSchema = z.object({
  name: z.string().trim().min(1, 'お名前は必須です。'),
  address: z.string().trim().min(1, '住所は必須です。'),
  email: z
    .string()
    .trim()
    .min(1, 'メールアドレスは必須です。')
    .email('無効なメールアドレスです。'),
})

export type CartCheckoutValues = z.infer<typeof CartCheckoutSchema>
