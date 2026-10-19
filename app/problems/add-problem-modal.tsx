'use client'

import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlusCircle } from 'react-icons/fi'

interface AddProblemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  existingCategories: string[]
}

export default function AddProblemModal({
  isOpen,
  onClose,
  onSuccess,
  existingCategories,
}: AddProblemModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [problemName, setProblemName] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy')
  const [problemUrl, setProblemUrl] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  if (!isOpen) return null

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === '__NEW__') {
      setIsCustomCategory(true)
      setCategory('')
    } else {
      setIsCustomCategory(false)
      setCategory(val)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const selectedCategory = isCustomCategory ? customCategory.trim() : category

    if (!selectedCategory) {
      setError('Please select or specify a category')
      setLoading(false)
      return
    }

    try {
      const payload = {
        problemName,
        problemUrl,
        category: selectedCategory,
        difficulty,
        date,
      }

      await axios.post('/api/admin/problems', payload)
      onSuccess()
      onClose()
      setProblemName('')
      setProblemUrl('')
      setCategory('')
      setCustomCategory('')
      setIsCustomCategory(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add problem module')
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
              Add Problem Module
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Problem Name
              </label>
              <input
                required
                type="text"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                placeholder="e.g. Two Sum"
                className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Problem URL
              </label>
              <input
                required
                type="url"
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full bg-transparent border-b border-white/10 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Category
              </label>
              <select
                value={isCustomCategory ? '__NEW__' : category}
                onChange={handleCategoryChange}
                className="w-full bg-black border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                <option value="" disabled>Select a Category</option>
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__NEW__">+ Add New Category</option>
              </select>

              {isCustomCategory && (
                <input
                  required
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category name..."
                  className="w-full bg-transparent border-b border-blue-400 py-2 mt-2 text-white placeholder:text-slate-600 focus:outline-none text-sm font-mono"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-black border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  Date
                </label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
              <FiPlusCircle size={16} />
              {loading ? 'Adding...' : 'Add Problem'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
