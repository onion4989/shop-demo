'use client'

import { ProblemPage } from '@/components/ProblemPage'

export default function ErrorPage() {
  return (
    <ProblemPage
      bgClassName="bg-[#373737]"
      textClassName="text-white"
      buttonClassName="bg-white text-[#373737] hover:bg-white/90"
    />
  )
}
