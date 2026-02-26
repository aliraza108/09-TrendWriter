"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FormatSelector } from '@/components/posts/FormatSelector'
import { LinkedInPreview } from '@/components/posts/LinkedInPreview'
import { PostVariantCard } from '@/components/posts/PostVariantCard'
import { TopicChip } from '@/components/posts/TopicChip'
import { Badge } from '@/components/ui/Badge'

const topics = [
  { topic: 'AI workflows for solo founders', urgency: 'high' as const },
  { topic: 'LinkedIn hook templates', urgency: 'high' as const },
  { topic: 'Creator monetization trends', urgency: 'medium' as const },
  { topic: 'B2B storytelling examples', urgency: 'medium' as const },
  { topic: 'Evergreen thought leadership', urgency: 'low' as const },
]

const formats = [
  { id: 'thought', name: 'Thought Leadership', description: 'Strong opinion with evidence', avg: '8.2%' },
  { id: 'story', name: 'Story', description: 'Narrative + lesson', avg: '9.7%' },
  { id: 'insight', name: 'Insight', description: 'Data + perspective', avg: '7.8%' },
  { id: 'hook', name: 'Hook', description: 'Short punchy opener', avg: '6.9%' },
  { id: 'carousel', name: 'Carousel', description: 'Multi-point format', avg: '11.4%' },
]

const variants = [
  {
    hook: 'Most creators do not fail from bad ideas. They fail from weak systems.',
    body: 'I spent months chasing topics instead of building a repeatable process. Once I moved to a weekly strategy stack, consistency and engagement both improved.',
    cta: 'Comment SYSTEM and I will share the checklist.',
    hashtags: ['LinkedInTips', 'CreatorEconomy', 'ContentStrategy'],
    score: 88,
  },
  {
    hook: 'Your next post should start with this sentence pattern.',
    body: 'Use this structure: painful truth, contrast, proof, simple action. This keeps attention through line three and improves dwell time.',
    cta: 'Save this for your next draft.',
    hashtags: ['Writing', 'Growth', 'B2BMarketing'],
    score: 82,
  },
  {
    hook: 'I analyzed 150 posts. One format won by a wide margin.',
    body: 'Story-led insight posts created the highest share rate and meaningful comments. Technical explainers performed best on impressions but lower on depth.',
    cta: 'Want the full dataset? Reply DATA.',
    hashtags: ['Analytics', 'LinkedIn', 'PersonalBrand'],
    score: 91,
  },
]

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState(topics[0].topic)
  const [format, setFormat] = useState(formats[0].id)
  const [selected, setSelected] = useState(variants[0])
  const [date, setDate] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  const confetti = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ id: i, left: `${Math.random() * 100}%`, delay: i * 0.04 })),
    [successOpen],
  )

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-textDark">Create Post</h1>

        {step === 1 && (
          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 1 - Topic Selection</h2>
            <div className="flex flex-wrap gap-2">
              {topics.map((item) => (
                <TopicChip key={item.topic} {...item} selected={topic === item.topic} onClick={() => setTopic(item.topic)} />
              ))}
            </div>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Or enter your own topic"
              className="w-full rounded-input border p-2"
            />
            <FormatSelector formats={formats} selected={format} onChange={setFormat} />
            <Button onClick={() => setStep(2)}>Generate Variants</Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 2 - Generated Variants</h2>
            <p className="mt-1 text-sm text-textGray">AI is crafting your posts...</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {variants.map((variant, i) => (
                <motion.div key={variant.hook} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <PostVariantCard {...variant} onSelect={() => setSelected(variant)} />
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setStep(3)}>Continue to Schedule</Button>
              <Button variant="secondary">Generate More Variants</Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-textDark">Step 3 - Schedule</h2>
            <LinkedInPreview content={`${selected.hook}\n\n${selected.body}\n\n${selected.cta}`} />
            <Badge>AI Recommended Time: Tuesday 10:00 AM - Highest engagement window</Badge>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-input border p-2" />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  toast.success(`Post scheduled for ${date || 'next available slot'}`)
                  setSuccessOpen(true)
                }}
              >
                Schedule Post
              </Button>
              <Button variant="secondary" onClick={() => toast.success('Publishing started')}>Publish Now</Button>
            </div>
          </Card>
        )}
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          {confetti.map((dot) => (
            <motion.span
              key={dot.id}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 300, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, delay: dot.delay }}
              className="absolute h-2 w-2 rounded-full bg-accentBlue"
              style={{ left: dot.left, top: '20%' }}
            />
          ))}
          <Card className="w-full max-w-md p-6 text-center">
            <h3 className="text-2xl font-bold text-textDark">Post Scheduled!</h3>
            <p className="mt-2 text-sm text-textGray">Scheduled time: {date || 'AI recommended next slot'}</p>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" onClick={() => { setStep(1); setSuccessOpen(false) }}>Create Another</Button>
              <Button variant="secondary" className="flex-1" onClick={() => { window.location.href = '/dashboard/calendar' }}>View Calendar</Button>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}