// login.ts
'use server'

import * as z from 'zod'

import { prisma } from '@/lib/server/prisma'
import { LoginSchema } from '@/schemas/Index'

import { signIn } from '@/lib/server/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/server/auth/routes'

import { getTwoFactorConfirmationByUserId } from '@/lib/server/auth/data/towFactorConfirmation'
import { getTwoFactorTokenbyEmail } from '@/lib/server/auth/data/twoFactorToken'
import { getUserByEmail } from '@/lib/server/auth/data/user'

import {
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from '@/lib/server/auth/mail'

import {
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/server/auth/tokens'

import { logger } from '@/lib/logger'
import { AuthError } from 'next-auth' // ★追加

export const Login = async (values: z.infer<typeof LoginSchema>) => {
  logger.log('[Login action] called:', values)

  // 入力フィールドのチェック
  const validated = LoginSchema.safeParse(values)
  if (!validated.success) {
    return { error: '無効なフィールドです。' }
  }

  const { email, password, code } = validated.data

  // メールは存在するか？
  const existingUser = await getUserByEmail(email)

  logger.log('[Login action] existingUser:', {
    id: existingUser?.id,
    email: existingUser?.email,
    // セキュリティ: パスワード情報はログに出力しない
    isTwoFactorEnabled: existingUser?.isTwoFactorEnabled,
    emailVerified: existingUser?.emailVerified,
  })

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'お使いのメールアドレスが見つかりませんでした！' }
  }

  // 確認メールで本人確認が完了したか？
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    )

    return { success: '確認メールを送信しました！' }
  }

  // 2段階認証が有効なユーザーか？
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // 2FA コード検証フェーズ
      const twoFactorToken = await getTwoFactorTokenbyEmail(existingUser.email)

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: '無効なコードです！' }
      }

      const hasExpired = twoFactorToken.expires < new Date()
      if (hasExpired) {
        return { error: 'コードが期限切れです！' }
      }

      // 2FA トークン削除
      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      })

      // 既存の 2FA 確認レコードがあれば削除
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      )

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        })
      }

      // 新しく 2FA 確認レコードを作成
      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      })

      // ここまで来れば 2FA OK → 後続で signIn 実行
    } else {
      // コード未入力 → 2FA トークン発行 + メール送信
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token)

      return { twoFactor: true }
    }
  }

  // ここまで来たら通常のサインイン処理
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    // redirectTo がある場合、ここまで処理が戻らずにリダイレクトされることも多い
    return { success: 'ログインに成功しました。' }
  } catch (error: unknown) {
    // 開発環境では詳細なエラー情報をログに出力
    if (process.env.NODE_ENV === 'development') {
      console.error('[Login action] signIn error:', error)
      console.error('[Login action] error type:', typeof error)
      if (error && typeof error === 'object') {
        console.error('[Login action] error keys:', Object.keys(error))
        if ('digest' in error) {
          console.error(
            '[Login action] error digest:',
            (error as { digest?: unknown }).digest
          )
        }
        if ('message' in error) {
          console.error(
            '[Login action] error message:',
            (error as { message?: unknown }).message
          )
        }
        if ('name' in error) {
          console.error(
            '[Login action] error name:',
            (error as { name?: unknown }).name
          )
        }
      }
    }

    // ★ AuthError だけをハンドリングする
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return {
          error: 'メールアドレスまたはパスワードが間違っています。',
        }
      }

      return { error: 'ログインに失敗しました。' }
    }

    // ★ リダイレクトエラー（NEXT_REDIRECT）は正常な動作なので再throwする
    // Next.jsのredirect()関数はNEXT_REDIRECTというdigestを持つエラーをthrowする
    // このエラーを再throwすることで、リダイレクトが実行される
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, unknown>

      // digestプロパティをチェック
      if ('digest' in errorObj && errorObj.digest === 'NEXT_REDIRECT') {
        // リダイレクトエラーは再throwして、リダイレクトを実行させる
        throw error
      }

      // messageプロパティをチェック（シリアライズされたエラーの場合）
      if ('message' in errorObj) {
        const message = String(errorObj.message)
        if (message.includes('NEXT_REDIRECT') || message.includes('redirect')) {
          // リダイレクトエラーは再throwして、リダイレクトを実行させる
          throw error
        }
      }

      // nameプロパティをチェック
      if ('name' in errorObj && errorObj.name === 'NEXT_REDIRECT') {
        // リダイレクトエラーは再throwして、リダイレクトを実行させる
        throw error
      }
    }

    // ★ それ以外のエラーはそのまま投げる
    throw error
  }
}
