"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CalendarClock, FileText, TrendingUp, Users } from "lucide-react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { StatCard } from "@/components/ui/StatCard"
import { Button } from "@/components/ui/Button"
import { EngagementChart } from "@/components/charts/EngagementChart"
import { formatDate, timeUntil } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { api } from "@/lib/api"
import { pickNumber, pickString, toArray, toRecord } from "@/lib/normalize"

type DashboardPost = {
  id: string
  title: string
  content: string
  status: "draft" | "scheduled" | "published" | "failed"
  impressions: number
  likes: number
  comments: number
  scheduledAt?: string
}

function normalizePosts(payload: unknown): DashboardPost[] {
  return toArray(payload).map((item, idx) => {
    const row = toRecord(item)
    return {
      id: pickString(row.id ?? row._id, `post-${idx}`),
      title: pickString(row.title ?? row.topic, "Untitled post"),
      content: pickString(row.content ?? row.body, ""),
      status: (pickString(row.status, "draft") as DashboardPost["status"]) || "draft",
      impressions: pickNumber(row.impressions),
      likes: pickNumber(row.likes),
      comments: pickNumber(row.comments),
      scheduledAt: pickString(row.scheduled_at ?? row.scheduledAt, ""),
    }
  })
}

function normalizeEngagement(payload: unknown) {
  const rows = toArray(payload)
  if (!rows.length) return []
  return rows.map((item, idx) => {
    const row = toRecord(item)
    return {
      day: pickString(row.day ?? row.date, `${idx + 1}`),
      impressions: pickNumber(row.impressions),
      likes: pickNumber(row.likes),
      comments: pickNumber(row.comments),
    }
  })
}

export default function DashboardPage() {
  const router = useRouter()
  const user = useAppStore((s) => s.user)
  const userId = useAppStore((s) => s.userId)

  const postsQuery = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => api.getUserPosts(userId as string),
    enabled: Boolean(userId),
  })
  const engagementQuery = useQuery({
    queryKey: ["engagement", userId, 30],
    queryFn: () => api.getEngagement(userId as string, 30),
    enabled: Boolean(userId),
  })

  const posts = useMemo(() => normalizePosts(postsQuery.data), [postsQuery.data])
  const engagement = useMemo(() => normalizeEngagement(engagementQuery.data), [engagementQuery.data])

  const scheduled = posts.filter((p) => p.status === "scheduled")
  const published = posts.filter((p) => p.status === "published")
  const topPost = [...posts].sort((a, b) => b.impressions + b.likes - (a.impressions + a.likes))[0]

  return (
    <PageWrapper>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-textDark">Good morning, {user?.name || "Creator"}</h1>
          <p className="text-sm text-textGray">{formatDate(new Date())}</p>
        </header>

        {!userId && (
          <Card className="p-5">
            <p className="text-sm text-textGray">Complete onboarding to load your posts and analytics.</p>
          </Card>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Posts Published" value={published.length} trend={0} icon={<FileText size={16} />} />
          <StatCard
            label="Avg Engagement Rate"
            value={published.length ? Number(((posts.reduce((acc, p) => acc + p.likes + p.comments, 0) / Math.max(1, posts.reduce((acc, p) => acc + p.impressions, 0))) * 100).toFixed(2)) : 0}
            suffix="%"
            trend={0}
            icon={<TrendingUp size={16} />}
          />
          <StatCard label="Followers Gained" value={0} trend={0} icon={<Users size={16} />} />
          <StatCard label="Scheduled Posts" value={scheduled.length} trend={0} icon={<CalendarClock size={16} />} />
        </section>

        <Button className="w-full bg-brand-gradient py-4 text-base md:w-auto" onClick={() => router.push("/dashboard/create")}>
          Generate New Post
        </Button>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-textDark">Engagement (Last 30 Days)</h2>
            <div className="mt-4 overflow-x-auto">
              {engagement.length ? (
                <EngagementChart data={engagement} />
              ) : (
                <p className="text-sm text-textGray">No engagement data yet. Publish posts to see trends.</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Upcoming Posts</h2>
            <div className="mt-3 space-y-2">
              {scheduled.length ? (
                scheduled.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-md bg-offWhite p-3">
                    <p className="text-sm font-medium text-textDark">{item.title}</p>
                    <p className="text-xs text-textGray">
                      {item.scheduledAt && !Number.isNaN(new Date(item.scheduledAt).getTime())
                        ? `in ${timeUntil(new Date(item.scheduledAt))}`
                        : "time not set"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-textGray">No scheduled posts.</p>
              )}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Top Performing Post</h2>
            {topPost ? (
              <>
                <p className="mt-3 text-sm text-textGray">"{topPost.title}"</p>
                <p className="mt-2 text-sm text-textDark">
                  {topPost.impressions} impressions | {topPost.likes} likes | {topPost.comments} comments
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm text-textGray">No published posts yet.</p>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Recent Activity</h2>
            {posts.length ? (
              <ul className="mt-3 space-y-2 text-sm text-textGray">
                {posts.slice(0, 3).map((p) => (
                  <li key={p.id}>
                    {p.status} - {p.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-textGray">No activity yet.</p>
            )}
          </Card>
        </section>
      </div>
    </PageWrapper>
  )
}
