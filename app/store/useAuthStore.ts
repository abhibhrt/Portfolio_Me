// src/store/useAuthStore.ts
import { create } from 'zustand'

interface UserProfile {
  id: string
  username: string
  name?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
}

interface AuthState {
  isAdmin: boolean
  user: UserProfile | null
  loading: boolean
  setAuth: (user: UserProfile | null) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  user: null,
  loading: true,
  setAuth: (user) => set({ user, isAdmin: !!user, loading: false }),
  clearAuth: () => set({ user: null, isAdmin: false, loading: false }),
  setLoading: (loading) => set({ loading }),
}))