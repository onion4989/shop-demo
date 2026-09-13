import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { template: '%s | Cake Shop Demo', default: 'Home' },
  description:
    'AIケーキショップ。カップケーキ、アイスケーキなどおいしいケーキがたくさん!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`min-h-dvh antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
