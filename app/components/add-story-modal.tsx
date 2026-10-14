'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUploadCloud } from 'react-icons/fi'

interface AddStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddStoryModal({ isOpen, onClose, onSuccess }: AddStoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select an image or video file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('caption', caption)

      await axios.post('/api/admin/story', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onSuccess()
      onClose()
      setFile(null)
      setCaption('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload story')
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
          className="relative w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider">
              Add New Story
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Story File (Image / Video)
              </label>
              <input
                required
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-mono file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Caption (Optional)
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 text-sm resize-none"
              />
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
              <FiUploadCloud size={16} />
              {loading ? 'Uploading...' : 'Publish Story'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}