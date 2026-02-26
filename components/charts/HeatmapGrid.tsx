type HeatmapCell = { day: string; hour: string; value: number }

const levelClass = (value: number) => {
  if (value > 75) return 'bg-primary text-white'
  if (value > 50) return 'bg-accentBlue text-white'
  if (value > 25) return 'bg-lightBlue text-primary'
  return 'bg-slate-100 text-slate-500'
}

type HeatmapGridProps = {
  data: HeatmapCell[]
}

export function HeatmapGrid({ data }: HeatmapGridProps) {
  return (
    <div className="grid min-w-[560px] grid-cols-6 gap-2">
      {data.map((cell) => (
        <div key={`${cell.day}-${cell.hour}`} className={`rounded-md p-3 text-xs ${levelClass(cell.value)}`}>
          <p>{cell.day}</p>
          <p>{cell.hour}</p>
        </div>
      ))}
    </div>
  )
}