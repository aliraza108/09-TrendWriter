"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { CalendarGrid } from "@/components/calendar/CalendarGrid"
import { PostDrawer } from "@/components/calendar/PostDrawer"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { api } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { pickString, toArray, toRecord } from "@/lib/normalize"

type CalendarItem = {
  id: string
  date: number
  title: string
  status: "scheduled" | "published" | "draft" | "failed"
  content: string
}

function normalizeCalendar(payload: unknown): CalendarItem[] {
  const now = new Date()
  return toArray(payload).map((item, idx) => {
    const row = toRecord(item)
    const rawDate = pickString(row.scheduled_at ?? row.scheduledAt ?? row.date, "")
    const dateObj = rawDate ? new Date(rawDate) : now
    const status = pickString(row.status, "scheduled") as CalendarItem["status"]
    return {
      id: pickString(row.id ?? row._id, `cal-${idx}`),
      date: Number.isNaN(dateObj.getTime()) ? now.getDate() : dateObj.getDate(),
      title: pickString(row.title ?? row.topic, "Untitled"),
      status: ["scheduled", "published", "draft", "failed"].includes(status) ? status : "scheduled",
      content: pickString(row.content ?? row.body, ""),
    }
  })
}

export default function CalendarPage() {
  const userId = useAppStore((s) => s.userId)
  const [view, setView] = useState<"month" | "week">("month")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const calendarQuery = useQuery({
    queryKey: ["calendar", userId],
    queryFn: () => api.getCalendar(userId as string),
    enabled: Boolean(userId),
  })

  const items = useMemo(() => normalizeCalendar(calendarQuery.data), [calendarQuery.data])
  const selectedPost = useMemo(() => items.find((p) => p.id === selectedId), [items, selectedId])

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-textDark">Content Calendar</h1>
          <div className="flex gap-2">
            <Button variant={view === "month" ? "primary" : "secondary"} onClick={() => setView("month")}>
              Month
            </Button>
            <Button variant={view === "week" ? "primary" : "secondary"} onClick={() => setView("week")}>
              Week
            </Button>
          </div>
        </div>

        {!userId && (
          <Card className="p-5">
            <p className="text-sm text-textGray">Complete onboarding to load your calendar.</p>
          </Card>
        )}

        {userId && !items.length ? (
          <Card className="p-5">
            <p className="text-sm text-textGray">No scheduled posts yet.</p>
          </Card>
        ) : (
          <CalendarGrid
            monthLabel={view === "month" ? "Current Month" : "Week View"}
            daysInMonth={view === "month" ? 31 : 7}
            items={items}
            onSelect={setSelectedId}
          />
        )}

        <PostDrawer
          open={Boolean(selectedId)}
          onClose={() => setSelectedId(null)}
          post={selectedPost ? { title: selectedPost.title, content: selectedPost.content, status: selectedPost.status } : undefined}
        />
      </div>
    </PageWrapper>
  )
}

