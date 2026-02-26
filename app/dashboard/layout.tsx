"use client"

import { useEffect, useState } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { OnboardingModal } from '@/components/layout/OnboardingModal'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { useAppStore } from '@/lib/store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user)
  const darkMode = useAppStore((s) => s.darkMode)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} userName={user?.name} />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 pb-24 pt-4 md:px-6 lg:pb-6">{children}</main>
      </div>
      <BottomNav />
      <OnboardingModal />
    </div>
  )
}