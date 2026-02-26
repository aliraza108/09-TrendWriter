"use client"

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'

export function useUser() {
  const userId = useAppStore((s) => s.userId)

  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId as string),
    enabled: Boolean(userId),
  })
}