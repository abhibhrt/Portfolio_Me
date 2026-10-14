// src/app/page.tsx
'use client'

import HomePage from './home/main.home'
import AboutSection from './home/about.home'
import { useAuthCheck } from '@/app/hooks/useAuthCheck'

const SHORT_IDS = [
  'RP-dHcdcJh4',
  '7LiQUfmYKkg',
  'PaBRTK8LOa0',
  'AB_Q0DhzO8s',
  'wFgBdj7aLAE',
  'TV1z60b9E30',
  'awkviHaVowE',
  'KknABu4SAmc',
  'SkrCBc0vY8g',
  'yPWM74Bxl2s',
  'CxwV8wILkaw',
  'kYlTMH2DWRY',
  'XA-gFL97q1g',
  'XvywuglUZ1k',
  'YrbWKil2gxw',
]

export default function Home() {
  useAuthCheck()
  return (
    <div className="flex flex-col gap-12 pb-16">
      <HomePage />
      {/* <YouTubeShortsSection shortIds={SHORT_IDS} /> */}
      <AboutSection />
    </div>
  )
}