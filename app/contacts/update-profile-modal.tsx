'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave } from 'react-icons/fi'
import { useAuthStore } from '@/app/store/useAuthStore'

interface UpdateProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UpdateProfileModal({ isOpen, onClose, onSuccess }: UpdateProfileModalProps) {
  const { user, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [country, setCountry] = useState('India')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setStreet(user.address?.street || '')
      setCity(user.address?.city || '')
      setState(user.address?.state || '')
      setPincode(user.address?.pincode || '')
      setCountry(user.address?.country || 'India')
    }
  }, [user])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        name,
        email,
        phone,
        address: { street, city, state, pincode, country },
      }

      const res = await axios.post('/api/admin/my-profile', payload)
      if (res.data.success) {
        setAuth(res.data.user)
        onSuccess()
        onClose()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">
              Update Admin Profile
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-white/5 pb-1">
                Address Config
              </span>
              <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-red-400 bg-red-950/20 p-2 rounded border border-red-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <FiSave size={16} />
              {loading ? 'Saving...' : 'Save Profile Details'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}