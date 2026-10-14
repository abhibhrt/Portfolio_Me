'use client'

import { useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/app/store/useAuthStore'

export function useAuthCheck() {
  const { setAuth, clearAuth, setLoading } = useAuthStore()

  const verifySession = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/admin/my-profile')
      const userData = res.data?.user ?? res.data
      if (userData) {
        setAuth(userData)
      } else {
        clearAuth()
      }
    } catch (error) {
      clearAuth()
    } finally {
      setLoading(false)
    }
  }, [setAuth, clearAuth, setLoading])

  useEffect(() => {
    verifySession()
  }, [verifySession])

  return { verifySession }
}