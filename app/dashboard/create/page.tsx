"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { FormatSelector } from "@/components/posts/FormatSelector"
import { LinkedInPreview } from "@/components/posts/LinkedInPreview"
import { PostVariantCard } from "@/components/posts/PostVariantCard"
import { TopicChip } from "@/components/posts/TopicChip"
import { Badge } from "@/components/ui/Badge"
import { api } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { pickNumber, pickString, toArray, toRecord } from "@/lib/normalize"

type Variant = {
  hook: string
  body: string
  cta: string
  hashtags: string[]
  score: number
}

function splitPostText(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const hook = lines[0] || "Generated post"
  const cta =
    lines.find((l) => /comment|follow|share|save|dm|message|reply/i.test(l)) ||
    "Share your perspective in comments."
  const body = lines.slice(1).join("\n") || text || "Generated content"
  return { hook, body, cta }
}

const formats = [
  { id: "thought", name: "Thought Leadership", description: "Strong opinion with evidence", avg: "8.2%" },
  { id: "story", name: "Story", description: "Narrative + lesson", avg: "9.7%" },
  { id: "insight", name: "Insight", description: "Data + perspective", avg: "7.8%" },
  { id: "hook", name: "Hook", description: "Short punchy opener", avg: "6.9%" },
  { id: "carousel", name: "Carousel", description: "Multi-point format", avg: "11.4%" },
]

function normalizeTopics(payload: unknown) {
  const rows = toArray(payload)
  return rows
    .map((item) => {
      const row = toRecord(item)
      return {
        topic: pickString(row.topic ?? row.title, ""),
        urgency: (pickString(row.urgency, "medium") as "low" | "medium" | "high") || "medium",
      }
    })
    .filter((x) => x.topic)
}

function normalizeVariants(payload: unknown): Variant[] {
  if (typeof payload === "string") {
    const parsed = splitPostText(payload)
    return [{ ...parsed, hashtags: [], score: 75 }]
  }

  const root = toRecord(payload)
  const directText =
    pickString(root.generated_content, "") ||
    pickString(root.content, "") ||
    pickString(root.text, "")
  if (directText) {
    const parsed = splitPostText(directText)
    return [{ ...parsed, hashtags: [], score: 75 }]
  }

  const keyedVariants = Object.keys(root)
    .filter((k) => /^variant[_-]?\d+$/i.test(k))
    .map((k) => root[k])
    .filter((v) => typeof v === "string") as string[]
  if (keyedVariants.length) {
    return keyedVariants.map((v) => {
      const parsed = splitPostText(v)
      return { ...parsed, hashtags: [], score: 75 }
    })
  }

  const rows = toArray(payload)
  return rows
    .map((item) => {
      if (typeof item === "string") {
        const parsed = splitPostText(item)
        return { ...parsed, hashtags: [], score: 75 }
      }

      const row = toRecord(item)
      const fullText = pickString(row.content ?? row.body, "")
      const parsed = splitPostText(fullText)
      return {
        hook: pickString(row.hook, parsed.hook),
        body: pickString(row.body, parsed.body),
        cta: pickString(row.cta, parsed.cta),
        hashtags: Array.isArray(row.hashtags) ? row.hashtags.map((h) => String(h).replace(/^#/, "")) : [],
        score: pickNumber(row.score ?? row.predicted_score, 75),
      }
    })
    .filter((v) => v.body)
}

export default function CreatePage() {
  const router = useRouter()
  const userId = useAppStore((s) => s.userId)
  const clearUser = useAppStore((s) => s.clearUser)
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState("")
  const [format, setFormat] = useState(formats[0].id)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selected, setSelected] = useState<Variant | null>(null)
  const [date, setDate] = useState("")
  const [successOpen, setSuccessOpen] = useState(false)

  const topicsQuery = useQuery({
    queryKey: ["strategy-topics", userId],
    queryFn: () => api.getStrategy(userId as string),
    enabled: Boolean(userId),
  })
  const topics = useMemo(() => normalizeTopics(topicsQuery.data), [topicsQuery.data])

  useEffect(() => {
    if (!topic && topics.length) setTopic(topics[0].topic)
  }, [topic, topics])

  const generateMutation = useMutation({
    mutationFn: async () => {
      const payload = { user_id: userId || undefined, topic, format }
      try {
        const variantsResult = await api.generateVariants(payload)
        const parsedVariants = normalizeVariants(variantsResult)
        if (parsedVariants.length) return parsedVariants
      } catch {
        // Fallback below.
      }

      const contentResult = await api.generateContent(payload)
      const parsedContent = normalizeVariants(contentResult)
      return parsedContent
    },
    onSuccess: (parsed) => {
      if (!parsed.length) {
        toast.error("No post was generated. Try another topic.")
        return
      }
      setVariants(parsed)
      setSelected(parsed[0])
      setStep(2)
      toast.success("Variants generated")
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to generate posts"
      if (message.includes("User not found")) {
        clearUser()
        localStorage.removeItem("user_id")
        toast.error("Session expired. Please complete onboarding again.")
        router.push("/dashboard")
        return
      }
      toast.error(message)
    },
  })

  const scheduleMutation = useMutation({
    mutationFn: () =>
      api.schedulePost({
        user_id: userId,
        content: `${selected?.hook}\n\n${selected?.body}\n\n${selected?.cta}`,
        scheduled_at: date || undefined,
        topic,
        format,
      }),
    onSuccess: () => {
      setSuccessOpen(true)
      toast.success("Post scheduled")
    },
    onError: () => toast.error("Could not schedule post"),
  })

  const publishMutation = useMutation({
    mutationFn: () =>
      api.publishPost({
        user_id: userId,
        content: `${selected?.hook}\n\n${selected?.body}\n\n${selected?.cta}`,
        topic,
      }),
    onSuccess: () => toast.success("Publish request sent"),
    onError: () => toast.error("Publish failed"),
  })

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-textDark">Create Post</h1>

        {!userId && (
          <Card className="p-5">
            <p className="text-sm text-textGray">Complete onboarding first to generate and schedule posts.</p>
          </Card>
        )}

        {step === 1 && (
          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 1 - Topic Selection</h2>
            <div className="flex flex-wrap gap-2">
              {topics.length ? (
                topics.map((item) => (
                  <TopicChip key={item.topic} {...item} selected={topic === item.topic} onClick={() => setTopic(item.topic)} />
                ))
              ) : (
                <p className="text-sm text-textGray">No trending topics yet. Enter your own topic below.</p>
              )}
            </div>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Or enter your own topic"
              className="w-full rounded-input border p-2"
            />
            <FormatSelector formats={formats} selected={format} onChange={setFormat} />
            <Button
              loading={generateMutation.isPending}
              onClick={() => generateMutation.mutate()}
              disabled={!topic || generateMutation.isPending}
            >
              Generate Variants
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 2 - Generated Variants</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {variants.map((variant, i) => (
                <motion.div key={`${variant.hook}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <PostVariantCard {...variant} onSelect={() => setSelected(variant)} />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setStep(3)} disabled={!selected}>
                Continue to Schedule
              </Button>
              <Button
                variant="secondary"
                loading={generateMutation.isPending}
                onClick={() => generateMutation.mutate()}
                disabled={!topic || generateMutation.isPending}
              >
                Generate More Variants
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && selected && (
          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 3 - Schedule</h2>
            <LinkedInPreview content={`${selected.hook}\n\n${selected.body}\n\n${selected.cta}`} />
            <Badge>AI Recommended Time: Tuesday 10:00 AM - Highest engagement window</Badge>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-input border p-2" />
            <div className="flex flex-wrap gap-2">
              <Button loading={scheduleMutation.isPending} onClick={() => scheduleMutation.mutate()} disabled={!userId || scheduleMutation.isPending}>
                Schedule Post
              </Button>
              <Button
                variant="secondary"
                loading={publishMutation.isPending}
                onClick={() => publishMutation.mutate()}
                disabled={!userId || publishMutation.isPending}
              >
                Publish Now
              </Button>
            </div>
          </Card>
        )}
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <Card className="w-full max-w-md p-6 text-center">
            <h3 className="text-2xl font-bold text-textDark">Post Scheduled!</h3>
            <p className="mt-2 text-sm text-textGray">Scheduled time: {date || "AI recommended next slot"}</p>
            <div className="mt-5 flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  setStep(1)
                  setVariants([])
                  setSelected(null)
                  setSuccessOpen(false)
                }}
              >
                Create Another
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => router.push("/dashboard/calendar")}>
                View Calendar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}
