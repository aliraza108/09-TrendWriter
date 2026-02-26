"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

type DeferredPrompt = Event & {
  prompt: () => Promise<void>
}

export function InstallBanner() {
  const [promptEvent, setPromptEvent] = useState<DeferredPrompt | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('tw-install-dismissed')
    if (dismissed) return
    if (window.innerWidth > 768) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const handler = (event: Event) => {
      event.preventDefault()
      setPromptEvent(event as DeferredPrompt)
      timer = setTimeout(() => setOpen(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  if (!open) return null

  return (
    <motion.div initial={{ y: 120 }} animate={{ y: 0 }} className="fixed bottom-4 left-4 right-4 z-50 rounded-card bg-brand-gradient p-4 text-white shadow-xl md:left-auto md:max-w-md">
      <p className="text-sm font-semibold">Install TrendWriter - Post smarter, grow faster</p>
      <div className="mt-3 flex gap-2">
        <Button
          variant="secondary"
          className="bg-white"
          onClick={async () => {
            if (promptEvent) await promptEvent.prompt()
            setOpen(false)
          }}
        >
          Add to Home Screen
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={() => {
            localStorage.setItem('tw-install-dismissed', '1')
            setOpen(false)
          }}
        >
          Dismiss
        </Button>
      </div>
    </motion.div>
  )
}
