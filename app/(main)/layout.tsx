import Footer from '@components/footer/Footer'
import FooterBar from '@components/footer/FooterBar'
import Navigations from '@components/header/Navigation'
import Providers from '@features/ui/Providers'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Navigations />
      {children}
      <Footer />
      <FooterBar />
    </Providers>
  )
}
