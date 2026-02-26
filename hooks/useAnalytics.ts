"use client"

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'

export function useAnalytics(days = 30) {
  const userId = useAppStore((s) => s.userId)

  return useQuery({
    queryKey: ['analytics', userId, days],
    queryFn: () => api.getEngagement(userId as string, days),
    enabled: Boolean(userId),
  })
}