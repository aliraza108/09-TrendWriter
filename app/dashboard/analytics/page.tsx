"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { RefreshCcw } from "lucide-react"
import { EngagementChart } from "@/components/charts/EngagementChart"
import { GrowthChart } from "@/components/charts/GrowthChart"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { StatCard } from "@/components/ui/StatCard"
import { Button } from "@/components/ui/Button"
import { api } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { pickNumber, pickString, toArray, toRecord } from "@/lib/normalize"

function normalizeEngagement(payload: unknown) {
  return toArray(payload).map((item, idx) => {
    const row = toRecord(item)
    return {
      day: pickString(row.day ?? row.date, `${idx + 1}`),
      impressions: pickNumber(row.impressions),
      likes: pickNumber(row.likes),
      comments: pickNumber(row.comments),
    }
  })
}

function normalizeGrowth(payload: unknown) {
  return toArray(payload).map((item, idx) => {
    const row = toRecord(item)
    return {
      day: pickString(row.day ?? row.date, `${idx + 1}`),
      followers: pickNumber(row.followers ?? row.follower_count),
    }
  })
}

export default function AnalyticsPage() {
  const userId = useAppStore((s) => s.userId)
  const [range, setRange] = useState("30d")
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30

  const engagementQuery = useQuery({
    queryKey: ["analytics-engagement", userId, days],
    queryFn: () => api.getEngagement(userId as string, days),
    enabled: Boolean(userId),
  })
  const growthQuery = useQuery({
    queryKey: ["analytics-growth", userId],
    queryFn: () => api.getGrowth(userId as string),
    enabled: Boolean(userId),
  })

  const engagement = useMemo(() => normalizeEngagement(engagementQuery.data), [engagementQuery.data])
  const growth = useMemo(() => normalizeGrowth(growthQuery.data), [growthQuery.data])

  const totals = useMemo(
    () => ({
      impressions: engagement.reduce((acc, row) => acc + row.impressions, 0),
      likes: engagement.reduce((acc, row) => acc + row.likes, 0),
      engagementRate: engagement.length
        ? Number(
            (
              (engagement.reduce((acc, row) => acc + row.likes + row.comments, 0) /
                Math.max(1, engagement.reduce((acc, row) => acc + row.impressions, 0))) *
              100
            ).toFixed(2),
          )
        : 0,
      followers: growth.length ? Math.max(growth[growth.length - 1].followers - growth[0].followers, 0) : 0,
    }),
    [engagement, growth],
  )

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-textDark">Analytics</h1>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((key) => (
              <Button key={key} variant={range === key ? "primary" : "secondary"} onClick={() => setRange(key)}>
                {key}
              </Button>
            ))}
          </div>
        </div>

        {!userId && (
          <Card className="p-5">
            <p className="text-sm text-textGray">Complete onboarding to load analytics.</p>
          </Card>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Impressions" value={totals.impressions} trend={0} icon={<RefreshCcw size={16} />} />
          <StatCard label="Total Likes" value={totals.likes} trend={0} icon={<RefreshCcw size={16} />} />
          <StatCard label="Avg Engagement Rate" value={totals.engagementRate} suffix="%" trend={0} icon={<RefreshCcw size={16} />} />
          <StatCard label="Followers Gained" value={totals.followers} trend={0} icon={<RefreshCcw size={16} />} />
        </section>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-textDark">Engagement Over Time</h2>
          <div className="mt-4 overflow-x-auto">
            {engagement.length ? (
              <EngagementChart data={engagement} />
            ) : (
              <p className="text-sm text-textGray">No engagement data available.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-textDark">Follower Growth</h2>
          <div className="mt-4 overflow-x-auto">
            {growth.length ? <GrowthChart data={growth} /> : <p className="text-sm text-textGray">No follower growth data available.</p>}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}

