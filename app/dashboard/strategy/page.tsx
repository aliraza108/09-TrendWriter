"use client"

import { useMutation } from '@tanstack/react-query'
import { BrainCircuit } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/lib/store'

const topics = [
  ['Build in public metrics', 'high'],
  ['Weekly contrarian view', 'medium'],
  ['Customer story teardown', 'high'],
  ['Trend vs tactic debate', 'medium'],
  ['Framework carousel', 'low'],
  ['Opinion + data pair', 'high'],
] as const

export default function StrategyPage() {
  const userId = useAppStore((s) => s.userId)
  const refresh = useMutation({
    mutationFn: () => api.getStrategy(userId || 'demo-user'),
    onSuccess: () => toast.success('Strategy refreshed'),
    onError: () => toast.error('Could not refresh strategy'),
  })

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-textDark">Strategy</h1>
          <Button loading={refresh.isPending} onClick={() => refresh.mutate()}>
            Refresh Strategy
          </Button>
        </div>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className={`${refresh.isPending ? 'animate-pulse' : ''}`} />
            <span className="font-semibold">Recommended Topics</span>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {topics.map(([title, urgency]) => (
              <div key={title} className="rounded-md bg-offWhite p-3">
                <p className="text-sm font-medium text-textDark">{title}</p>
                <Badge className="mt-2" tone={urgency === 'high' ? 'error' : urgency === 'medium' ? 'warning' : 'default'}>{urgency}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">7-Day Preview</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="rounded-md border bg-white p-2">
                  <p className="font-medium text-textDark">{day}</p>
                  <p className="text-textGray">{i % 2 === 0 ? 'Story' : 'Insight'}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Best Times</h2>
            <div className="mt-3 space-y-2 text-sm text-textGray">
              <p>Tuesday 10:00 AM - highest reach window</p>
              <p>Thursday 1:00 PM - high comment density</p>
              <p>Sunday 9:00 AM - strong saves and shares</p>
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-textDark">Insights</h2>
          <p className="mt-3 text-sm text-textGray">Audience response peaks on structured narratives with one clear takeaway. Posts with concrete metrics are outperforming generic tips by 34% this month.</p>
        </Card>
      </div>
    </PageWrapper>
  )
}