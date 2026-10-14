'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import PageHeader from '@/app/components/page-header'
import CommonLoading from '@/app/components/loading'
import ProjectsGrid from './projects-grid'
import AddProjectModal from './add-project-modal'
import UpdateProjectModal from './update-project-modal'
import { useAuthStore } from '@/app/store/useAuthStore'
import { FiPlus } from 'react-icons/fi'

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const { isAdmin } = useAuthStore()

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get('/api/projects')
      setProjects(res.data ?? [])
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleEditClick = (project: Project) => {
    setSelectedProject(project)
    setIsUpdateModalOpen(true)
  }

  return (
    <section className="relative py-24 pt-30 px-6 overflow-hidden" id="Projects">
      <div className="relative z-10 max-w-7xl mx-auto">
        <PageHeader
          name="Projects Modules"
          path="abhibhrt/projects"
          action={
            isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="cursor-pointer w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                title="Add New Project"
              >
                <FiPlus size={22} />
              </button>
            )
          }
        />

        {loading ? (
          <CommonLoading text="Fetching Projects..." />
        ) : projects.length > 0 ? (
          <ProjectsGrid
            projects={projects}
            onEdit={handleEditClick}
            onDeleteSuccess={fetchProjects}
          />
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-lg bg-black/20 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase text-slate-500">No Projects Found</span>
          </div>
        )}
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchProjects}
      />

      <UpdateProjectModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchProjects}
        project={selectedProject}
      />
    </section>
  )
}