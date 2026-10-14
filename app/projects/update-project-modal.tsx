'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSave } from 'react-icons/fi'

interface Project {
  _id: string
  title: string
  description: string
  features: string
  url: string
  createdAt: string
  github?: string
  visit?: string
  projectDate?: string
}

interface UpdateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  project: Project | null
}

export default function UpdateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project,
}: UpdateProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [features, setFeatures] = useState('')
  const [description, setDescription] = useState('')
  const [github, setGithub] = useState('')
  const [visit, setVisit] = useState('')
  const [projectDate, setProjectDate] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (project) {
      setTitle(project.title || '')
      setFeatures(project.features || '')
      setDescription(project.description || '')
      setGithub(project.github || '')
      setVisit(project.visit || '')
      setProjectDate(project.projectDate ? project.projectDate.split('T')[0] : '')
      setFile(null)
    }
  }, [project])

  if (!isOpen || !project) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('title', title)
      formData.append('features', features)
      formData.append('description', description)
      formData.append('github', github)
      formData.append('visit', visit)
      formData.append('projectDate', projectDate)

      await axios.put(`/api/admin/projects/${project._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update project')
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
              Update Project Module
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Replace Image File (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-mono file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Title
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Features / Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                  Live URL
                </label>
                <input
                  type="text"
                  value={visit}
                  onChange={(e) => setVisit(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1">
                Project Date
              </label>
              <input
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
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
              <FiSave size={16} />
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}