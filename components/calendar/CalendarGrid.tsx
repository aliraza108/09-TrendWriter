import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

type CalendarItem = {
  id: string
  date: number
  title: string
  status: 'scheduled' | 'published' | 'draft' | 'failed'
}

type CalendarGridProps = {
  monthLabel: string
  daysInMonth: number
  items: CalendarItem[]
  onSelect: (id: string) => void
}

const statusTone = {
  scheduled: 'default',
  published: 'success',
  draft: 'warning',
  failed: 'error',
} as const

export function CalendarGrid({ monthLabel, daysInMonth, items, onSelect }: CalendarGridProps) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <Card className="p-4">
      <h2 className="mb-4 text-lg font-semibold text-textDark">{monthLabel}</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayItems = items.filter((item) => item.date === day)
          return (
            <div key={day} className="min-h-24 rounded-md border border-slate-200 p-2">
              <p className="text-xs font-semibold text-textGray">{day}</p>
              <div className="mt-2 space-y-1">
                {dayItems.map((item) => (
                  <button key={item.id} className="block w-full text-left" onClick={() => onSelect(item.id)}>
                    <Badge tone={statusTone[item.status]} className="w-full justify-center truncate">
                      {item.title}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}