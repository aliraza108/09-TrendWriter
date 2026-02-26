"use client"

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAppStore } from '@/lib/store'

export function usePosts() {
  const userId = useAppStore((s) => s.userId)

  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => api.getUserPosts(userId as string),
    enabled: Boolean(userId),
  })
}