import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

type Format = {
  id: string
  name: string
  description: string
  avg: string
}

type FormatSelectorProps = {
  formats: Format[]
  selected: string
  onChange: (id: string) => void
}

export function FormatSelector({ formats, selected, onChange }: FormatSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      {formats.map((item) => (
        <button key={item.id} onClick={() => onChange(item.id)} className="text-left">
          <Card className={cn('p-4', selected === item.id && 'border-2 border-primary bg-lightBlue')}>
            <p className="font-semibold text-textDark">{item.name}</p>
            <p className="mt-1 text-sm text-textGray">{item.description}</p>
            <p className="mt-2 text-xs font-medium text-primary">Avg engagement {item.avg}</p>
          </Card>
        </button>
      ))}
    </div>
  )
}