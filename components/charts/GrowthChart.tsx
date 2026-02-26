"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type GrowthChartProps = {
  data: Array<{ day: string; followers: number }>
}

export function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="h-64 min-w-[560px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="followers" stroke="#0A66C2" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}