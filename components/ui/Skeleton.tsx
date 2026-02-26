import { cn } from '@/lib/utils'

type SkeletonProps = {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('h-4 w-full rounded-md shimmer-bg animate-shimmer', className)} />
}