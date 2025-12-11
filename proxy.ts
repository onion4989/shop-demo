// /home/takashi_ogawa/shop-demo/proxy.ts
import { auth } from '@/lib/server/auth'
import type { Session } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

// NextAuth v5 の auth ミドルウェアで渡されるリクエスト型
type AuthRequest = NextRequest & {
  auth: Session | null
}

export default auth((req: AuthRequest) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // /dashboard 以下は認証必須
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    const signInUrl = new URL('/auth/login', req.nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  // それ以外はそのまま
  return NextResponse.next()
})

// 管理画面だけを対象にする
export const config = {
  matcher: ['/dashboard/:path*'],
}
