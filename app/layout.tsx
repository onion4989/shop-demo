import { siteDesc, siteName, siteOg, siteOrigin } from '@lib/seo'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: { default: siteName, template: `%s｜${siteName}` },
  description: siteDesc,
  robots: { index: false, follow: false },
  openGraph: siteOg,
  twitter: { card: 'summary', title: siteName, description: siteDesc },
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
