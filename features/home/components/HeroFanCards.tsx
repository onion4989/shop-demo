import { HeroFanCardsDesktopLazy } from '@features/home/components/HeroFanCardsDesktopLazy'
import { HeroFanCardsMobile } from '@features/home/components/HeroFanCardsMobile'

/** Server: Mobile RSC fan + Desktop animation loaded only on md+. */
export function HeroFanCards() {
  return (
    <>
      <HeroFanCardsMobile />
      <HeroFanCardsDesktopLazy />
    </>
  )
}
