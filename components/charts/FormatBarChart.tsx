"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type FormatBarChartProps = {
  data: Array<{ format: string; score: number }>
}

export function FormatBarChart({ data }: FormatBarChartProps) {
  return (
    <div className="h-64 min-w-[560px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="format" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="score" fill="#0A66C2" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}