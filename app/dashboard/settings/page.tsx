"use client"

import { useState } from 'react'
import { Linkedin, Moon, Sun } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAppStore } from '@/lib/store'

export default function SettingsPage() {
  const user = useAppStore((s) => s.user)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)
  const darkMode = useAppStore((s) => s.darkMode)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [niche, setNiche] = useState(user?.niche || '')
  const [audience, setAudience] = useState(user?.targetAudience || '')

  return (
    <PageWrapper>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-textDark">Settings</h1>

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-textDark">Profile</h2>
          <input className="w-full rounded-input border p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input className="w-full rounded-input border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="w-full rounded-input border p-2" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche" />
          <input className="w-full rounded-input border p-2" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Target audience" />
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-textDark">Posting Preferences</h2>
          <label className="text-sm text-textGray">Frequency</label>
          <input type="range" min={1} max={14} defaultValue={4} className="w-full" />
          <select className="w-full rounded-input border p-2">
            <option>Professional</option>
            <option>Conversational</option>
            <option>Bold</option>
          </select>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-textDark">LinkedIn Connection</h2>
          <Button className="gap-2"><Linkedin size={16} /> Connect LinkedIn Account</Button>
        </Card>

        <Card className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-textDark">Appearance</h2>
          <Button variant="secondary" className="gap-2" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </Button>
        </Card>

        <Card className="border border-red-200 p-5">
          <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
          <Button className="mt-3 bg-error hover:bg-red-700">Delete account</Button>
        </Card>
      </div>
    </PageWrapper>
  )
}