"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Point = { day: string; impressions: number; likes: number; comments: number }

type EngagementChartProps = {
  data: Point[]
}

export function EngagementChart({ data }: EngagementChartProps) {
  return (
    <div className="h-72 min-w-[560px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#0A66C2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="impressions" stroke="#0A66C2" fillOpacity={1} fill="url(#colorImpressions)" />
          <Area type="monotone" dataKey="likes" stroke="#70B5F9" fill="transparent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}