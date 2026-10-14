'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import CommonLoading from '@/app/components/loading'
import ViewStory from './view-story'
import AddStoryModal from './add-story-modal'
import { useAuthStore } from '@/app/store/useAuthStore'
import { FiPlus } from 'react-icons/fi'

interface StoryItem {
  _id: string
  url: string
  caption?: string
  createdAt: string
}

export default function PublicStories() {
  const [stories, setStories] = useState<StoryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const { isAdmin } = useAuthStore()

  const fetchStories = useCallback(async () => {
    try {
      const res = await axios.get('/api/story')
      setStories(res.data ?? [])
    } catch (err) {
      console.error('Failed to load stories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  const isVideo = (url: string) => {
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null
  }

  const handleNext = () => {
    if (currentIndex === null) return
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      closeStory()
    }
  }

  const handlePrev = () => {
    if (currentIndex === null) return
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const closeStory = () => {
    setCurrentIndex(null)
  }

  if (loading) {
    return <CommonLoading text="Loading Stories..." />
  }

  return (
    <div className="text-slate-100 px-6 flex flex-col">
      {/* INSTAGRAM FEED TRAILER (Horizontal Bubble List) */}
      <div className="w-full max-w-2xl py-4 overflow-x-auto flex space-x-5 scrollbar-none items-center">
        
        {/* Admin Add Story Bubble Button */}
        {isAdmin && (
          <div className="flex flex-col items-center flex-shrink-0 space-y-1">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="cursor-pointer w-16 h-16 rounded-full p-[2px] bg-blue-600 active:scale-95 transition-transform flex items-center justify-center shadow-lg hover:bg-blue-500"
              title="Add New Story"
            >
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-blue-400">
                <FiPlus size={24} />
              </div>
            </button>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Add Story
            </span>
          </div>
        )}

        {/* Existing Story Bubbles */}
        {stories.map((story, index) => (
          <div key={story._id} className="flex flex-col items-center flex-shrink-0 space-y-1">
            <button
              onClick={() => setCurrentIndex(index)}
              className="cursor-pointer w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-fuchsia-600 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-slate-950 p-[2px]">
                {isVideo(story.url) ? (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    Video
                  </div>
                ) : (
                  <img
                    src={story.url}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(story.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        ))}

        {stories.length === 0 && !isAdmin && (
          <p className="text-xs text-slate-500 italic py-2">No active stories available.</p>
        )}
      </div>

      {/* FULLSCREEN INSTA STORY MODAL */}
      <ViewStory
        stories={stories}
        currentIndex={currentIndex}
        onClose={closeStory}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* ADD STORY MODAL */}
      <AddStoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStories}
      />
    </div>
  )
}