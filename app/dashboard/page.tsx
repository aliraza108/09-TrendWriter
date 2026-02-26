"use client"

import { CalendarClock, FileText, TrendingUp, Users } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { EngagementChart } from '@/components/charts/EngagementChart'
import { formatDate, timeUntil } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const upcoming = [
  { id: '1', title: 'Three automation mistakes to avoid', at: new Date(Date.now() + 1000 * 60 * 60 * 7) },
  { id: '2', title: 'My weekly content system in 20 minutes', at: new Date(Date.now() + 1000 * 60 * 60 * 20) },
  { id: '3', title: 'Hook framework with examples', at: new Date(Date.now() + 1000 * 60 * 60 * 29) },
]

const engagement = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  impressions: 800 + i * 40 + (i % 3) * 110,
  likes: 140 + i * 8,
  comments: 30 + i * 2,
}))

export default function DashboardPage() {
  const user = useAppStore((s) => s.user)

  return (
    <PageWrapper>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-textDark">Good morning, {user?.name || 'Creator'}</h1>
          <p className="text-sm text-textGray">{formatDate(new Date())}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Posts Published" value={248} trend={16} icon={<FileText size={16} />} />
          <StatCard label="Avg Engagement Rate" value={9.3} suffix="%" trend={8} icon={<TrendingUp size={16} />} />
          <StatCard label="Followers Gained" value={1420} trend={24} icon={<Users size={16} />} />
          <StatCard label="Scheduled Posts" value={12} trend={3} icon={<CalendarClock size={16} />} />
        </section>

        <Button className="w-full bg-brand-gradient py-4 text-base md:w-auto">Generate New Post</Button>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-textDark">Engagement (Last 30 Days)</h2>
            <div className="mt-4 overflow-x-auto">
              <EngagementChart data={engagement} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Upcoming Posts</h2>
            <div className="mt-3 space-y-2">
              {upcoming.map((item) => (
                <div key={item.id} className="rounded-md bg-offWhite p-3">
                  <p className="text-sm font-medium text-textDark">{item.title}</p>
                  <p className="text-xs text-textGray">in {timeUntil(item.at)}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Top Performing Post</h2>
            <p className="mt-3 text-sm text-textGray">"The 4-part framework that doubled my LinkedIn reach in 30 days"</p>
            <p className="mt-2 text-sm text-textDark">18.2k impressions | 1.6k likes | 312 comments</p>
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Recent Activity</h2>
            <ul className="mt-3 space-y-2 text-sm text-textGray">
              <li>Scheduled "Weekly AI workflow" - 10m ago</li>
              <li>Published "Content flywheel" - 2h ago</li>
              <li>Strategy refreshed - 1d ago</li>
            </ul>
          </Card>
        </section>
      </div>
    </PageWrapper>
  )
}