import { create } from 'zustand'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  isLoading: boolean
  profileLoaded: boolean
  isAuthenticated: boolean
  setUser: (user: User | null, profileLoaded?: boolean) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoading: true,
  profileLoaded: false,
  isAuthenticated: false,

  setUser: (user, profileLoaded = false) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      profileLoaded,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      profileLoaded: false,
    }),
}))
