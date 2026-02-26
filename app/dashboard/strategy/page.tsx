"use client"

import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BrainCircuit } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useAppStore } from "@/lib/store"
import { pickString, toArray, toRecord } from "@/lib/normalize"

type StrategyTopic = { title: string; urgency: "low" | "medium" | "high" }

function normalizeTopics(payload: unknown): StrategyTopic[] {
  return toArray(payload)
    .map((item) => {
      const row = toRecord(item)
      const urgency = pickString(row.urgency, "medium")
      return {
        title: pickString(row.topic ?? row.title, ""),
        urgency: ["low", "medium", "high"].includes(urgency) ? (urgency as StrategyTopic["urgency"]) : "medium",
      }
    })
    .filter((t) => t.title)
}

export default function StrategyPage() {
  const userId = useAppStore((s) => s.userId)
  const qc = useQueryClient()

  const strategyQuery = useQuery({
    queryKey: ["strategy", userId],
    queryFn: () => api.getStrategy(userId as string),
    enabled: Boolean(userId),
  })
  const topics = useMemo(() => normalizeTopics(strategyQuery.data), [strategyQuery.data])

  const refresh = useMutation({
    mutationFn: () => api.getStrategy(userId as string),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["strategy", userId] })
      toast.success("Strategy refreshed")
    },
    onError: () => toast.error("Could not refresh strategy"),
  })

  return (
    <PageWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-textDark">Strategy</h1>
          <Button loading={refresh.isPending} onClick={() => refresh.mutate()} disabled={!userId}>
            Refresh Strategy
          </Button>
        </div>

        {!userId && (
          <Card className="p-5">
            <p className="text-sm text-textGray">Complete onboarding to load strategy recommendations.</p>
          </Card>
        )}

        <Card className="p-5">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className={`${refresh.isPending ? "animate-pulse" : ""}`} />
            <span className="font-semibold">Recommended Topics</span>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {topics.length ? (
              topics.map((topic) => (
                <div key={topic.title} className="rounded-md bg-offWhite p-3">
                  <p className="text-sm font-medium text-textDark">{topic.title}</p>
                  <Badge className="mt-2" tone={topic.urgency === "high" ? "error" : topic.urgency === "medium" ? "warning" : "default"}>
                    {topic.urgency}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-textGray">No strategy topics available yet.</p>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}

