import { Flame } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

type TopicChipProps = {
  topic: string
  urgency: 'low' | 'medium' | 'high'
  selected?: boolean
  onClick?: () => void
}

export function TopicChip({ topic, urgency, selected, onClick }: TopicChipProps) {
  const tone = urgency === 'high' ? 'error' : urgency === 'medium' ? 'warning' : 'default'

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-2 text-sm transition ${selected ? 'border-primary bg-lightBlue' : 'border-slate-300 bg-white'}`}
    >
      <Flame size={14} className="text-warning" />
      <span>{topic}</span>
      <Badge tone={tone}>{urgency}</Badge>
    </button>
  )
}