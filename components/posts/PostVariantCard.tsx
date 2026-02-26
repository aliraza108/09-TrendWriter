"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

type PostVariantCardProps = {
  hook: string
  body: string
  cta: string
  hashtags: string[]
  score: number
  onSelect?: () => void
}

export function PostVariantCard({ hook, body, cta, hashtags, score, onSelect }: PostVariantCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="flex h-full flex-col p-5">
      <h3 className="text-lg font-semibold text-textDark">{hook}</h3>
      <p className="mt-2 text-sm text-textGray">{expanded ? body : `${body.slice(0, 120)}...`}</p>
      <button className="mt-1 text-left text-xs text-primary" onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Show less' : 'Expand'}
      </button>
      <p className="mt-3 text-sm font-medium text-textDark">{cta}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <Badge key={tag}>#{tag}</Badge>
        ))}
      </div>
      <motion.div className="mt-4 flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <ProgressRing value={score} />
        <Button onClick={onSelect}>Select This Variant</Button>
      </motion.div>
    </Card>
  )
}