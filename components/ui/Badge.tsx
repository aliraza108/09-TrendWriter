import { cn } from '@/lib/utils'

type BadgeProps = {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const toneMap = {
  default: 'bg-lightBlue text-primary',
  success: 'bg-green-100 text-success',
  warning: 'bg-amber-100 text-warning',
  error: 'bg-red-100 text-error',
}

export function Badge({ children, tone = 'default', className }: BadgeProps) {
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', toneMap[tone], className)}>{children}</span>
}