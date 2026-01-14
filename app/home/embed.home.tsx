'use client'

import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiYoutube, FiPlay } from 'react-icons/fi'

/* ---------------- CONFIG ---------------- */
const VISIBLE_COUNT = 7
const CENTER_INDEX = 3
const AUTO_SCROLL_INTERVAL = 3000
const TRANSITION_DURATION = 0.8

const cardConfigs = [
  { scale: 0.5, x: '130%', rotate: 0, zIndex: 10, opacity: 0.2, filter: 'grayscale(1) blur(2px)' },
  { scale: 0.7, x: '90%', rotate: 0, zIndex: 20, opacity: 0.4, filter: 'grayscale(0.8)' },
  { scale: 0.85, x: '45%', rotate: 0, zIndex: 30, opacity: 0.7, filter: 'grayscale(0.4)' },
  { scale: 1, x: '0%', rotate: 0, zIndex: 40, opacity: 1, filter: 'none' },
  { scale: 0.85, x: '-45%', rotate: 0, zIndex: 30, opacity: 0.7, filter: 'grayscale(0.4)' },
  { scale: 0.7, x: '-90%', rotate: 0, zIndex: 20, opacity: 0.4, filter: 'grayscale(0.8)' },
  { scale: 0.5, x: '-130%', rotate: 0, zIndex: 10, opacity: 0.2, filter: 'grayscale(1) blur(2px)' },
]

/* ---------------- CARD ---------------- */
const ShortsCard = memo(({
  videoId,
  position,
  isActive,
  isPlaying,
  onPlayStateChange,
}: {
  videoId: string
  position: number
  isActive: boolean
  isPlaying: boolean
  onPlayStateChange: (playing: boolean) => void
}) => {
  const baseParams = 'controls=0&rel=0&modestbranding=1&playsinline=1&fs=0&disablekb=1&loop=1&mute=0'
  const autoplayParam = isPlaying ? '&autoplay=1' : '&autoplay=0'
  const playlistParam = `&playlist=${videoId}`

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${baseParams}${autoplayParam}${playlistParam}`

  return (
    <motion.div
      animate={cardConfigs[position]}
      transition={{ duration: TRANSITION_DURATION, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        rounded-md overflow-hidden border transition-all duration-300
        ${isActive ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-slate-800 shadow-xl'}
        ${isActive ? 'cursor-pointer' : 'pointer-events-none'}
      `}
      style={{ width: 200, height: 350 }}
      onClick={() => isActive && onPlayStateChange(!isPlaying)}
    >
      <div className="relative w-full h-full bg-slate-900">
        <iframe
          key={`${videoId}-${isPlaying}`}
          src={embedUrl}
          title={videoId}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className={`w-full h-full pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />

        {/* Elite Overlay Details */}
        {!isPlaying && isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
                    <FiPlay className="text-white translate-x-0.5" />
                </div>
            </div>
        )}

        {isPlaying && (
          <div className="absolute top-3 right-3 bg-red-600 text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-tighter text-white animate-pulse">
            Live
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-800 p-2 backdrop-blur-md">
        <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase text-center">
          Short.ID: {videoId.substring(0,6)}
        </div>
      </div>
    </motion.div>
  )
})

ShortsCard.displayName = 'ShortsCard'

/* ---------------- MAIN SECTION ---------------- */
const YouTubeShortsSection = ({ shortIds }: { shortIds: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const getVideoIndex = (pos: number) =>
    (activeIndex + pos - CENTER_INDEX + shortIds.length) % shortIds.length

  const currentCenterVideoId = shortIds[getVideoIndex(CENTER_INDEX)]

  const handlePlayStateChange = (playing: boolean) => {
    if (playing) {
      setPlayingVideoId(currentCenterVideoId)
      setIsPlaying(true)
    } else {
      setPlayingVideoId(null)
      setIsPlaying(false)
    }
  }

  const next = () => {
    setPlayingVideoId(null)
    setIsPlaying(false)
    setActiveIndex(i => (i + 1) % shortIds.length)
  }

  const prev = () => {
    setPlayingVideoId(null)
    setIsPlaying(false)
    setActiveIndex(i => (i - 1 + shortIds.length) % shortIds.length)
  }

  useEffect(() => {
    if (isPlaying || isHovered) return
    const interval = setInterval(next, AUTO_SCROLL_INTERVAL)
    return () => clearInterval(interval)
  }, [activeIndex, isPlaying, isHovered])

  if (shortIds.length < 4) return null

  return (
    <section className="bg-slate-950 py-20 px-6 border-y border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-12 gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <FiYoutube className="text-red-600" size={20} />
              <span className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Featured Media</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              YouTube <span className="text-blue-500">Insights</span>
            </h2>
          </div>
          <p className="text-slate-500 text-xs font-medium md:text-right max-w-xs text-left">
            System paused on hover. Select the central node to initialize playback.
          </p>
        </div>

        <div
          className="relative h-[450px] w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Elite Grid/Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-slate-800 to-transparent" />
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          </div>

          {/* Cards */}
          {Array.from({ length: VISIBLE_COUNT }).map((_, pos) => {
            const videoId = shortIds[getVideoIndex(pos)]
            const isActive = pos === CENTER_INDEX
            const isCurrentlyPlaying = playingVideoId === videoId

            return (
              <ShortsCard
                key={videoId}
                videoId={videoId}
                position={pos}
                isActive={isActive}
                isPlaying={isCurrentlyPlaying}
                onPlayStateChange={handlePlayStateChange}
              />
            )
          })}

          {/* Nav Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 z-50">
            <button
              onClick={prev}
              disabled={isPlaying}
              className="cursor-pointer w-10 h-10 rounded-sm bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all disabled:opacity-20"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={next}
              disabled={isPlaying}
              className="cursor-pointer w-10 h-10 rounded-sm bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all disabled:opacity-20"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Elite Status Legend */}
        <div className="mt-16 flex justify-center border-t border-slate-900 pt-8">
          <div className="flex items-center gap-8">
            <StatusItem label="Standby" color="bg-slate-700" />
            <StatusItem label="Active Node" color="bg-blue-500" />
            <StatusItem label="Stream Active" color="bg-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}

const StatusItem = ({ label, color }: { label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</span>
  </div>
)

export default YouTubeShortsSection