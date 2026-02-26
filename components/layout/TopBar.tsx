"use client"

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type TopBarProps = {
  onMenu: () => void
  title?: string
}

export function TopBar({ onMenu, title = 'TrendWriter' }: TopBarProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
      <Button variant="ghost" className="px-2 py-2" onClick={onMenu}>
        <Menu size={18} />
      </Button>
      <span className="font-semibold text-textDark">{title}</span>
      <div className="w-8" />
    </div>
  )
}