"use client"

import CountUp from 'react-countup'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'

type StatCardProps = {
  label: string
  value: number
  suffix?: string
  trend?: number
  icon: React.ReactNode
}

export function StatCard({ label, value, suffix = '', trend = 0, icon }: StatCardProps) {
  const up = trend >= 0

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-textGray">{label}</span>
        <span className="rounded-full bg-lightBlue p-2 text-primary">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-textDark dark:text-white">
        <CountUp end={value} duration={1.2} separator="," />
        {suffix}
      </p>
      <div className={`mt-2 flex items-center gap-1 text-sm ${up ? 'text-success' : 'text-error'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{Math.abs(trend)}% vs last period</span>
      </div>
    </Card>
  )
}