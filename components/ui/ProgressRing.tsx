"use client"

import { motion } from 'framer-motion'

type ProgressRingProps = {
  value: number
}

export function ProgressRing({ value }: ProgressRingProps) {
  const normalized = Math.min(100, Math.max(0, value))
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalized / 100) * circumference

  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} stroke="#EBF3FF" strokeWidth="10" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#0A66C2"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-textDark">{normalized}%</span>
    </div>
  )
}