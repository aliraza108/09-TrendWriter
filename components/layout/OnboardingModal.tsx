"use client"

import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { pickString, toRecord } from '@/lib/normalize'

export function OnboardingModal() {
  const userId = useAppStore((s) => s.userId)
  const setUser = useAppStore((s) => s.setUser)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [niche, setNiche] = useState('')

  useEffect(() => {
    setOpen(!userId)
  }, [userId])

  const create = useMutation({
    mutationFn: () => api.createUser({ name, email, niche }),
    onSuccess: (user) => {
      const record = toRecord(user)
      const normalized = {
        id: pickString(record.id ?? record._id, crypto.randomUUID()),
        name,
        email,
        niche,
      }
      setUser(normalized)
      localStorage.setItem('user_id', normalized.id)
      toast.success('Profile created')
      setOpen(false)
    },
    onError: () => toast.error('Could not create user'),
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-textDark">Welcome to TrendWriter</h2>
        <p className="mt-1 text-sm text-textGray">Set up your profile to personalize recommendations.</p>
        <div className="mt-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-input border p-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-input border p-2" />
          <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Niche" className="w-full rounded-input border p-2" />
        </div>
        <Button
          loading={create.isPending}
          className="mt-4 w-full"
          onClick={() => create.mutate()}
          disabled={!name || !email || create.isPending}
        >
          Continue
        </Button>
      </Card>
    </div>
  )
}
