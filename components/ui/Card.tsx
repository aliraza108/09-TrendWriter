"use client"

import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardProps = Omit<HTMLMotionProps<'div'>, 'ref'>

export function Card({ className, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn('rounded-card bg-white shadow-card transition hover:shadow-lg dark:bg-slate-800', className)}
      {...props}
    />
  )
}
