'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface StoryItem {
  _id: string;
  url: string;
  caption?: string;
  createdAt: string;
}

const STORY_DURATION = 5000;

const PublicStories: React.FC = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);
  const remainingTime = useRef<number>(STORY_DURATION);

  // 1. Fetch Stories for Public
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('/api/story');
        setStories(res.data ?? []);
      } catch (err) {
        console.error('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // Helper: check if file is video
  const isVideo = (url: string) => {
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;
  };

  // 2. Story Timing Logic (Next/Prev/Auto-advance)
  const handleNext = () => {
    if (currentIndex === null) return;
    if (currentIndex < stories.length - 1) {
      setProgress(0);
      remainingTime.current = STORY_DURATION;
      setCurrentIndex(currentIndex + 1);
    } else {
      closeStory();
    }
  };

  const handlePrev = () => {
    if (currentIndex === null) return;
    if (currentIndex > 0) {
      setProgress(0);
      remainingTime.current = STORY_DURATION;
      setCurrentIndex(currentIndex - 1);
    }
  };

  const closeStory = () => {
    setCurrentIndex(null);
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  // Progress bar handler
  useEffect(() => {
    if (currentIndex === null) return;

    startTime.current = Date.now();
    const intervalTime = 50; // smooth update every 50ms

    progressInterval.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime.current;
      const totalProgress = ((STORY_DURATION - remainingTime.current) + elapsedTime) / STORY_DURATION * 100;

      if (totalProgress >= 100) {
        clearInterval(progressInterval.current!);
        handleNext();
      } else {
        setProgress(Math.min(totalProgress, 100));
      }
    }, intervalTime);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs tracking-widest uppercase">
        Loading Stories...
      </div>
    );
  }

  return (
    <div className="text-slate-100 px-6 flex flex-col">
      
      {/* INSTAGRAM FEED TRAILER (Horizontal Bubble List) */}
      <div className="w-full max-w-2xl py-4 overflow-x-auto flex space-x-5 scrollbar-none">
        {stories.map((story, index) => (
          <div key={story._id} className="flex flex-col items-center flex-shrink-0 space-y-1">
            <button
              onClick={() => {
                setCurrentIndex(index);
                setProgress(0);
                remainingTime.current = STORY_DURATION;
              }}
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
              {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}

        {stories.length === 0 && (
          <p className="text-xs text-slate-500 italic py-2">No active stories available.</p>
        )}
      </div>

      {/* FULLSCREEN INSTA STORY MODAL */}
      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center md:p-4 select-none touch-none"
          >
            {/* Desktop Desktop Prev Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="hidden md:flex items-center justify-center text-white bg-slate-900/50 p-3 rounded-full hover:bg-slate-800 absolute left-10 disabled:opacity-20 transition-all"
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
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[9px] font-black">
                      DEV
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">Admin Updates</span>
                  <span className="text-[10px] text-white/60">
                    {new Date(stories[currentIndex].createdAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <button onClick={closeStory} className="text-white drop-shadow-md p-1">
                  <FiX size={20} />
                </button>
              </div>

              {/* Tap Targets for Mobile (Left 30% goes back, Right 70% goes next) */}
              <div className="absolute inset-0 z-20 flex">
                <div className="w-[30%] h-full cursor-pointer" onClick={handlePrev} />
                <div className="w-[70%] h-full cursor-pointer" onClick={handleNext} />
              </div>

              {/* Actual Content Asset */}
              <div className="w-full h-full flex items-center justify-center bg-black">
                {isVideo(stories[currentIndex].url) ? (
                  <video
                    src={stories[currentIndex].url}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={stories[currentIndex].url}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>

              {/* Bottom Caption Box */}
              {stories[currentIndex].caption && (
                <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-8 px-5 text-center">
                  <p className="text-sm text-white font-medium tracking-wide drop-shadow-sm leading-relaxed">
                    {stories[currentIndex].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Next Arrow */}
            <button
              onClick={handleNext}
              className="hidden md:flex items-center justify-center text-white bg-slate-900/50 p-3 rounded-full hover:bg-slate-800 absolute right-10 transition-all"
            >
              <FiChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicStories;