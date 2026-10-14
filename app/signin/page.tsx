'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import PageHeader from '@/app/components/page-header'
import CommonLoading from '@/app/components/loading'

export default function AdminSigninPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

      if (response.data.success) {
        router.push('/')
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
    <section className="relative min-h-screen py-24 pt-30 px-6 overflow-hidden flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-lg shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-500 uppercase">
            Secured Portal
          </div>

          <form onSubmit={handleSignin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <FiUser size={12} /> Username
              </label>
              <input
                required
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-colors text-sm"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <FiLock size={12} /> Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 transition-colors text-sm"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-mono text-red-400 bg-red-950/20 border border-red-500/20 p-2 rounded">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-[0.2em] uppercase transition-all disabled:opacity-50 rounded-sm shadow-lg cursor-pointer"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Authorize Session
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