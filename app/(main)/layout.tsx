import Footer from '@components/footer/Footer'
import FooterBar from '@components/footer/FooterBar'
import Navigations from '@components/header/Navigation'
import { getCartCatalog } from '@features/cart/Loaders'
import { CartShell } from '@features/cart/components/CartShell'
import Providers from '@features/ui/Providers'

// Docker ビルド時は DB が無いため、Prisma を使うセグメントは静的生成しない
export const dynamic = 'force-dynamic'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cartCatalog = await getCartCatalog()

  return (
    <Providers>
      <Navigations />
      {children}
      <Footer />
      <FooterBar />
      <CartShell catalog={cartCatalog} />
    </Providers>
  )
}
