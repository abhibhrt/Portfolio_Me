'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiCalendar, FiLoader } from 'react-icons/fi'

// --- TYPES ---
interface Project {
  _id: string
  title: string
  description: string
  features: string
  url: string
  createdAt: string
  github?: string
  visit?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects')
        setProjects(res.data ?? [])
      } catch (error) {
        console.error('Failed to fetch modules:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section
      className="relative bg-slate-950 py-24 pt-30 px-6 overflow-hidden"
      id="Projects"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase">
            <span className="h-[1px] w-8 bg-blue-500" />
            Deployment_Log
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
            Featured <span className="text-slate-500">Modules</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <FiLoader className="animate-spin mb-4" size={24} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Syncing_Database...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-sm">
            <span className="text-[10px] font-mono uppercase text-slate-600">No_Active_Deployments_Found</span>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  // Convert features string (e.g. "React, Next.js") into an array
  const tags = project.features ? project.features.split(',').map(t => t.trim()) : []

  // Format the date from MongoDB createdAt
  const displayDate = new Date(project.createdAt).getFullYear().toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-slate-900/30 border border-slate-800 hover:border-blue-500/50 transition-all duration-500 rounded-lg overflow-hidden"
    >
      {/* Card Top Bar */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-800 bg-slate-900/50">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
        </div>
        <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
          ID: {project._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden border-b border-slate-800">
        <img
          src={project.url}
          alt={project.title}
          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
          <a
            href={project.github || '#'}
            target="_blank"
            className="p-3 bg-white text-slate-950 hover:bg-blue-500 hover:text-white transition-all rounded-sm"
          >
            <FiGithub size={18} />
          </a>
          <a
            href={project.visit || '#'}
            target="_blank"
            className="p-3 bg-white text-slate-950 hover:bg-blue-500 hover:text-white transition-all rounded-sm"
          >
            <FiExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
          <FiCalendar className="text-blue-500" />
          {displayDate}
        </div>

        <h3 className="text-xl font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
          {project.description}
        </p>

        {/* Dynamic Tags */}
        <div className="pt-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => {
            const isPrivate = tag.toLowerCase().includes('private')
            return (
              <span
                key={i}
                className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border ${isPrivate
                    ? 'border-red-900/50 text-red-500 bg-red-950/20'
                    : 'border-slate-800 text-slate-500 bg-slate-800/30'
                  }`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      </div>

      {/* Bottom Aesthetic Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}