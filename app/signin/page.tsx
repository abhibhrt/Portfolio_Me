'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/useAuthStore'

export default function AdminSigninPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await axios.post('/api/auth/signin', {
        username,
        password,
      })

      if (response.data?.success) {
        if (response.data.user) {
          setAuth(response.data.user)
        }
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Signin failed:', error)
      setErrorMessage(
        error.response?.data?.message || 'Invalid credentials or network error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen py-24 pt-32 px-6 overflow-hidden flex items-center justify-center text-white">
      <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl relative overflow-hidden"
        >
          {/* Top Accent Bar */}
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent" />

          {/* Card Header Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-black/50">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
              <FiShield className="text-blue-400" size={13} />
              Admin Access
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              Secured Portal
            </span>
          </div>

          <form onSubmit={handleSignin} className="p-6 sm:p-8 space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <FiUser size={12} /> Username
              </label>
              <input
                required
                type="text"
                autoComplete="username"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[0.02] focus:bg-white/[0.04] px-3 border-b border-white/15 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-all text-sm rounded-t-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <FiLock size={12} /> Password
              </label>
              <div className="relative flex items-center">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] focus:bg-white/[0.04] pl-3 pr-10 border-b border-white/15 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-all text-sm rounded-t-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-500/25 px-3.5 py-2.5 rounded-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-3 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 rounded-sm shadow-lg cursor-pointer"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  SignIn
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}