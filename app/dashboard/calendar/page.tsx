"use client"

import { useMemo, useState } from 'react'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { PostDrawer } from '@/components/calendar/PostDrawer'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'

const mockPosts = [
  { id: '1', date: 4, title: 'Founder story post', status: 'scheduled' as const, content: 'Long form founder story draft...' },
  { id: '2', date: 7, title: 'Industry trend insight', status: 'published' as const, content: 'Published trend insight...' },
  { id: '3', date: 12, title: 'Carousel: 5 hooks', status: 'draft' as const, content: 'Carousel outline...' },
  { id: '4', date: 17, title: 'Case study breakdown', status: 'failed' as const, content: 'Retry publish needed...' },
]

export default function CalendarPage() {
  const [view, setView] = useState<'month' | 'week'>('month')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedPost = useMemo(() => mockPosts.find((p) => p.id === selectedId), [selectedId])

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-textDark">Content Calendar</h1>
          <div className="flex gap-2">
            <Button variant={view === 'month' ? 'primary' : 'secondary'} onClick={() => setView('month')}>Month</Button>
            <Button variant={view === 'week' ? 'primary' : 'secondary'} onClick={() => setView('week')}>Week</Button>
          </div>
        </div>

        <CalendarGrid monthLabel={view === 'month' ? 'February 2026' : 'Week View'} daysInMonth={view === 'month' ? 28 : 7} items={mockPosts} onSelect={setSelectedId} />

        <PostDrawer open={Boolean(selectedId)} onClose={() => setSelectedId(null)} post={selectedPost ? { title: selectedPost.title, content: selectedPost.content, status: selectedPost.status } : undefined} />
      </div>
    </PageWrapper>
  )
}