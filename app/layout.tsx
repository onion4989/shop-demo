// /home/takashi_ogawa/shop-demo/app/layout.tsx
import { AuthProvider } from '@/features/auth/AuthProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      {/* ↓ ここに suppressHydrationWarning={true} を追加 */}
      <body suppressHydrationWarning={true}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
