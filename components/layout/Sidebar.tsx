"use client"

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart3, Brain, CalendarDays, Home, PlusSquare, Settings, UserCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/create', label: 'Create Post', icon: PlusSquare },
  { href: '/dashboard/calendar', label: 'Content Calendar', icon: CalendarDays },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/strategy', label: 'Strategy', icon: Brain },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

type SidebarProps = {
  mobileOpen: boolean
  onClose: () => void
  userName?: string
}

export function Sidebar({ mobileOpen, onClose, userName = 'Creator' }: SidebarProps) {
  const pathname = usePathname()

  const linkNodes = useMemo(
    () =>
      links.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 text-sm font-medium transition',
              active
                ? 'border-primary bg-lightBlue text-primary'
                : 'border-transparent text-textGray hover:bg-offWhite hover:text-textDark',
            )}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        )
      }),
    [onClose, pathname],
  )

  return (
    <>
      <aside className="hidden h-screen w-60 shrink-0 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col dark:border-slate-700 dark:bg-slate-900">
        <div className="rounded-card bg-brand-gradient p-4 text-lg font-bold text-white">TrendWriter</div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">{linkNodes}</nav>
        <div className="mt-auto flex items-center gap-3 rounded-card bg-lightBlue p-3">
          <UserCircle2 className="text-primary" />
          <div>
            <p className="text-sm font-semibold text-textDark">{userName}</p>
            <p className="text-xs text-textGray">Pro Plan</p>
          </div>
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} aria-label="Close menu" />}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-slate-200 bg-white p-4 lg:hidden"
      >
        <div className="rounded-card bg-brand-gradient p-4 text-lg font-bold text-white">TrendWriter</div>
        <nav className="mt-6 flex flex-1 flex-col gap-1">{linkNodes}</nav>
      </motion.aside>
    </>
  )
}