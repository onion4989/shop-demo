// /home/takashi_ogawa/shop-demo/components/auth/loginForm.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import * as z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Login } from '@/lib/server/auth/actions/login'
import { LoginSchema } from '@/schemas/Index'

import { CardWrapper } from '@/components/auth/cardWrapper'
import { FormError } from '@/components/error'
import { FormSuccess } from '@/components/success'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BeatLoader } from 'react-spinners'

export const LoginForm = () => {
  const searchParams = useSearchParams()

  // NextAuth の error クエリ (?error=...) からメッセージを生成
  const urlErrorParam = searchParams.get('error')
  const urlError =
    urlErrorParam === 'OAuthAccountNotLinked'
      ? 'メールは別のプロバイダーで既に使用されています!'
      : urlErrorParam === 'CredentialsSignin'
        ? 'メールアドレスまたはパスワードが間違っています。'
        : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '', // 2FA 用。schema 側で optional / 空文字許可にしておく
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      Login(values)
        .then((data) => {
          if (data?.error) {
            form.reset({
              // email は残しても良いので必要に応じて調整
              email: values.email,
              password: '',
              code: '',
            })
            setError(data.error)
            setShowTwoFactor(false)
          }

          if (data?.twoFactor) {
            // 2段階認証フェーズへ移行
            setShowTwoFactor(true)
            setSuccess('メールに送信されたコードを入力してください。')
          }

          if (data?.success) {
            form.reset()
            setSuccess(data.success)
          }
        })
        .catch((error) => {
          // リダイレクトエラー（NEXT_REDIRECT）は正常な動作なので無視
          // Server Actionからクライアントにエラーが伝播する際、エラーがシリアライズされるため
          // エラーの形式が変わる可能性がある
          if (error && typeof error === 'object') {
            const errorObj = error as Record<string, unknown>

            // digestプロパティをチェック（NEXT_REDIRECT）
            if ('digest' in errorObj) {
              const digest = String(errorObj.digest)
              if (digest === 'NEXT_REDIRECT' || digest.includes('NEXT_REDIRECT')) {
                // リダイレクトが発生しているので、エラーメッセージを表示しない
                // リダイレクトエラーは正常な動作なので、ログも出力しない
                return
              }
            }

            // messageプロパティをチェック（シリアライズされたエラーの場合）
            if ('message' in errorObj) {
              const message = String(errorObj.message)
              if (message.includes('NEXT_REDIRECT') || message.includes('redirect')) {
                // リダイレクトが発生しているので、エラーメッセージを表示しない
                // リダイレクトエラーは正常な動作なので、ログも出力しない
                return
              }
            }
          }

          // 開発環境でエラーの詳細をログに出力（リダイレクトエラー以外）
          if (process.env.NODE_ENV === 'development') {
            console.error('[LoginForm] catch error:', error)
            console.error('[LoginForm] error type:', typeof error)
            if (error && typeof error === 'object') {
              console.error('[LoginForm] error keys:', Object.keys(error))
              if ('digest' in error) {
                console.error('[LoginForm] error digest:', (error as { digest?: unknown }).digest)
              }
              if ('message' in error) {
                console.error('[LoginForm] error message:', (error as { message?: unknown }).message)
              }
            }
          }

          // それ以外のエラーのみ表示
          setError('何か問題が発生しました。')
        })
    })
  }

  return (
    <CardWrapper
      headerLabel="ようこそ"
      backButtonLabel="アカウントはまだですか?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 2FA コード入力フェーズ */}
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2段階認証コード</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123456"
                      inputMode="numeric"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          )}

          {/* 通常のメール / パスワード入力フェーズ */}
          {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="you@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="********"
                        type="password"
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/reset">パスワードをお忘れですか？</Link>
                    </Button>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* エラー / 成功メッセージ */}
          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <BeatLoader size={8} />
            ) : showTwoFactor ? (
              '確認'
            ) : (
              'ログイン'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
