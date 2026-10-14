'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface StoryItem {
  _id: string
  url: string
  caption?: string
  createdAt: string
}

interface ViewStoryProps {
  stories: StoryItem[]
  currentIndex: number | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

const STORY_DURATION = 5000

export default function ViewStory({
  stories,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ViewStoryProps) {
  const [progress, setProgress] = useState<number>(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const startTime = useRef<number>(0)
  const remainingTime = useRef<number>(STORY_DURATION)

  const isVideo = (url: string) => {
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null
  }

  // Reset/update timer when index changes
  useEffect(() => {
    if (currentIndex === null) return

    startTime.current = Date.now()
    remainingTime.current = STORY_DURATION
    setProgress(0)
    const intervalTime = 50 // smooth update every 50ms

    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime.current
      const totalProgress =
        ((STORY_DURATION - remainingTime.current) + elapsedTime) /
        STORY_DURATION *
        100

      if (totalProgress >= 100) {
        clearInterval(progressInterval.current!)
        onNext()
      } else {
        setProgress(Math.min(totalProgress, 100))
      }
    }, intervalTime)

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [currentIndex, onNext])

  if (currentIndex === null) return null

  const currentStory = stories[currentIndex]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center md:p-4 select-none touch-none"
      >
        {/* Desktop Prev Arrow */}
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="hidden md:flex items-center justify-center text-white bg-slate-900/50 p-3 rounded-full hover:bg-slate-800 absolute left-10 disabled:opacity-20 transition-all cursor-pointer"
        >
          <FiChevronLeft size={24} />
        </button>

        {/* Main Story Window */}
        <div className="relative w-full h-full md:max-w-[420px] md:h-[85vh] md:rounded-xl overflow-hidden bg-slate-950 flex flex-col shadow-2xl border border-slate-900">
          
          {/* Top Progress Indicators */}
          <div className="absolute top-3 inset-x-0 z-30 flex px-3 space-x-1.5">
            {stories.map((_, idx) => (
              <div key={idx} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                    transition: idx === currentIndex ? 'none' : undefined,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="absolute top-6 inset-x-0 z-30 flex justify-between items-center px-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[9px] font-black text-white">
                  DEV
                </div>
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Admin Updates</span>
              <span className="text-[10px] text-white/60">
                {new Date(currentStory.createdAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <button onClick={onClose} className="text-white drop-shadow-md p-1 cursor-pointer">
              <FiX size={20} />
            </button>
          </div>

          {/* Tap Targets for Mobile (Left 30% goes back, Right 70% goes next) */}
          <div className="absolute inset-0 z-20 flex">
            <div className="w-[30%] h-full cursor-pointer" onClick={onPrev} />
            <div className="w-[70%] h-full cursor-pointer" onClick={onNext} />
          </div>

          {/* Actual Content Asset */}
          <div className="w-full h-full flex items-center justify-center bg-black">
            {isVideo(currentStory.url) ? (
              <video
                src={currentStory.url}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img
                src={currentStory.url}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
              />
            )}
          </div>

          {/* Bottom Caption Box */}
          {currentStory.caption && (
            <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-8 px-5 text-center">
              <p className="text-sm text-white font-medium tracking-wide drop-shadow-sm leading-relaxed">
                {currentStory.caption}
              </p>
            </div>
          )}
        </div>

        {/* Desktop Next Arrow */}
        <button
          onClick={onNext}
          className="hidden md:flex items-center justify-center text-white bg-slate-900/50 p-3 rounded-full hover:bg-slate-800 absolute right-10 transition-all cursor-pointer"
        >
          <FiChevronRight size={24} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}