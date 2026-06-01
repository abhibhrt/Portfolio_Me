'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera,
  FiX,
  FiTrash2,
  FiSend,
  FiClock,
} from 'react-icons/fi';
import { useAlert } from '@/app/hooks/useAlert';

/* -------------------------------------------------------------------------- */
/* Types                                   */
/* -------------------------------------------------------------------------- */

type ResourceType = 'image' | 'video';

interface StoryItem {
  _id: string;
  url: string;
  caption?: string;
  resource_type?: ResourceType; // Made optional to gracefully handle database states
  createdAt: string;
}

interface AdminTokenPayload {
  token?: string;
}

/* -------------------------------------------------------------------------- */
/* Component                                 */
/* -------------------------------------------------------------------------- */

const Story: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);

  const { showAlert } = useAlert();

  /* -------------------------------------------------------------------------- */
  /* Data Fetching                               */
  /* -------------------------------------------------------------------------- */

  const fetchStories = async (): Promise<void> => {
    setLoading(true);
    try {
      const res: AxiosResponse<StoryItem[]> = await axios.get('/api/story');
      setStories(res.data ?? []);
    } catch {
      showAlert('Failed to retrieve clinical updates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStories();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Helpers                                  */
  /* -------------------------------------------------------------------------- */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;

    const stored = window.localStorage.getItem('admin');
    if (!stored) return null;

    try {
      const admin: AdminTokenPayload = JSON.parse(stored);
      return admin?.token ?? null;
    } catch {
      return null;
    }
  };

  const resetSelection = (): void => {
    setFile(null);
    setPreview(null);
    setCaption('');
  };

  // Helper utility to safely figure out if a database asset is a video
  const isVideoAsset = (story: StoryItem): boolean => {
    if (story.resource_type === 'video') return true;
    return story.url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) !== null;
  };

  /* -------------------------------------------------------------------------- */
  /* Actions                                  */
  /* -------------------------------------------------------------------------- */

  const handleUpload = async (): Promise<void> => {
    if (!file) {
      showAlert('No media asset selected', 'warning');
      return;
    }

    const token = getToken();

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);

      const res: AxiosResponse<StoryItem> = await axios.post(
        '/api/story',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showAlert('Asset dispatched successfully', 'success');
      resetSelection();
      setStories((prev) => [res.data, ...prev]);
    } catch {
      showAlert('Dispatch failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Permanently delete this clinical record?')) return;

    const token = getToken();

    try {
      await axios.delete(`/api/story/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert('Record purged', 'success');
      setStories((prev) => prev.filter((s) => s._id !== id));
      setSelectedStory(null);
    } catch {
      showAlert('Purge failed', 'error');
    }
  };

  /* -------------------------------------------------------------------------- */

  return (
    <div className="space-y-12 min-h-screen bg-slate-950 text-slate-100 p-1">
      {/* Upload Terminal */}
      <section className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-200">
            Media Dispatch Terminal
          </h3>
          <span className="text-[9px] font-bold text-slate-500 uppercase">
            Input: Photo / Video
          </span>
        </div>

        <div className="p-8">
          {!preview ? (
            <div className="group relative border-2 border-dashed border-slate-800 hover:border-blue-500 transition-colors h-80 flex flex-col items-center justify-center bg-slate-950/40">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="p-6 bg-slate-900 border border-slate-800 shadow-md group-hover:border-blue-500/50 transition-colors">
                <FiCamera className="text-3xl text-slate-300" />
              </div>
              <p className="mt-6 text-[11px] font-black uppercase tracking-widest text-slate-300">
                Upload Clinical Update
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">
                Max File Size: 50MB
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden border border-slate-950">
                {file?.type.startsWith('video/') ? (
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                )}
                <button
                  onClick={resetSelection}
                  className="cursor-pointer absolute top-4 right-4 bg-slate-900/90 text-slate-300 p-2 border border-slate-800 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col justify-between">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter clinical description..."
                  className="w-full p-4 text-sm bg-slate-950 border border-slate-800 rounded-sm h-40 focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-600 resize-none"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="cursor-pointer mt-4 flex items-center justify-center space-x-3 bg-slate-100 text-slate-950 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
                >
                  <FiSend />
                  <span>
                    {uploading ? 'Processing Dispatch...' : 'Execute Dispatch'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Registry Grid */}
      <section>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Syncing Records...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {stories.map((story) => (
              <motion.div key={story._id} whileHover={{ y: -4 }}>
                <button
                  onClick={() => setSelectedStory(story)}
                  className="cursor-pointer relative w-full aspect-[3/4] bg-slate-900 border border-slate-800 rounded-sm overflow-hidden group focus:outline-none"
                >
                  {isVideoAsset(story) ? (
                    <video
                      src={story.url}
                      muted
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <img
                      src={story.url}
                      alt={story.caption || ""}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  {story.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-slate-300 line-clamp-2 text-left">
                        {story.caption}
                      </p>
                    </div>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <FiClock size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {mounted && story.createdAt
                        ? new Date(story.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })
                        : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(story._id)}
                    className="text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Deep-Dive Immersive Viewer */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-8 backdrop-blur-sm"
          >
            <div className="max-w-4xl w-full h-full flex flex-col justify-between">
              <button
                onClick={() => setSelectedStory(null)}
                className="cursor-pointer self-end text-slate-400 p-3 border border-slate-800 bg-slate-900/50 hover:text-white hover:border-slate-700 transition-colors mb-4"
              >
                <FiX size={18} />
              </button>
              <div className="flex-1 bg-black border border-slate-900 rounded-sm overflow-hidden flex items-center justify-center relative">
                {isVideoAsset(selectedStory) ? (
                  <video
                    src={selectedStory.url}
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedStory.url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              {selectedStory.caption && (
                <div className="mt-4 p-4 bg-slate-900 border border-slate-800 text-slate-300 text-xs tracking-wide leading-relaxed max-h-24 overflow-y-auto">
                  {selectedStory.caption}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Story;