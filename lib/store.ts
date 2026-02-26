"use client"

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type User = {
  id: string
  name: string
  email: string
  niche?: string
  targetAudience?: string
}

export type Post = {
  id: string
  topic: string
  content: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
}

type AppState = {
  user: User | null
  userId: string | null
  posts: Post[]
  darkMode: boolean
  setUser: (user: User) => void
  setUserId: (userId: string | null) => void
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  toggleDarkMode: () => void
  clearUser: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      userId: null,
      posts: [],
      darkMode: false,
      setUser: (user) => set({ user, userId: user.id }),
      setUserId: (userId) => set({ userId }),
      setPosts: (posts) => set({ posts }),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      clearUser: () => set({ user: null, userId: null, posts: [] }),
    }),
    {
      name: 'trendwriter-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        userId: state.userId,
        darkMode: state.darkMode,
      }),
    },
  ),
)
