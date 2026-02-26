"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Brain, CalendarDays, Home, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/create', label: 'Create', icon: Plus, floating: true },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/strategy', label: 'Strategy', icon: Brain },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white px-2 py-2 md:hidden">
      <ul className="grid grid-cols-5 items-end">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <li key={item.href} className="text-center">
              <Link href={item.href} className={cn('inline-flex flex-col items-center gap-1 text-xs', active ? 'text-primary' : 'text-textGray')}>
                <span className={cn(item.floating && 'rounded-full bg-primary p-3 text-white shadow-lg')}>
                  <Icon size={18} />
                </span>
                {!item.floating && <span>{item.label}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}