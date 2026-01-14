'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera,
  FiX,
  FiTrash2,
  FiSend,
  FiFilm,
  FiImage,
  FiClock,
} from 'react-icons/fi';
import { useAlert } from '@/app/hooks/useAlert';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ResourceType = 'image' | 'video';

interface StoryItem {
  _id: string;
  url: string;
  caption?: string;
  resource_type: ResourceType;
  createdAt: string;
}

interface AdminTokenPayload {
  token?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
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
  /*                               Data Fetching                                */
  /* -------------------------------------------------------------------------- */

  const fetchStories = async (): Promise<void> => {
    setLoading(true);

    try {
      const res: AxiosResponse<StoryItem[]> = await axios.get(
        '/api/routes/story'
      );
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
  /*                                Helpers                                     */
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

  /* -------------------------------------------------------------------------- */
  /*                                Actions                                     */
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
        '/api/routes/story',
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
      await axios.delete(`/api/routes/story/${id}`, {
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
    <div className="space-y-12">
      {/* Upload Terminal */}
      <section className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
            Media Dispatch Terminal
          </h3>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            Input: Photo/Video
          </span>
        </div>

        <div className="p-8">
          {!preview ? (
            <div className="group relative border-2 border-dashed border-slate-200 hover:border-blue-500 transition-colors h-80 flex flex-col items-center justify-center bg-slate-50/50">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="p-6 bg-white border border-slate-200 shadow-sm">
                <FiCamera className="text-3xl text-slate-900" />
              </div>
              <p className="mt-6 text-[11px] font-black uppercase tracking-widest">
                Upload Clinical Update
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                Max File Size: 50MB
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-video bg-black rounded-sm overflow-hidden border border-slate-900">
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
                  className="absolute top-4 right-4 bg-slate-900/80 text-white p-2 hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col justify-between">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter clinical description..."
                  className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-sm h-40"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 flex items-center justify-center space-x-3 bg-slate-900 text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 disabled:bg-slate-300"
                >
                  <FiSend />
                  <span>
                    {uploading
                      ? 'Processing Dispatch...'
                      : 'Execute Dispatch'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Registry */}
      <section>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Syncing Records...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {stories.map((story) => (
              <motion.div key={story._id} whileHover={{ y: -5 }}>
                <button
                  onClick={() => setSelectedStory(story)}
                  className="relative w-full aspect-[3/4] bg-slate-100 border border-slate-200 overflow-hidden"
                >
                  {story.resource_type === 'video' ? (
                    <video
                      src={story.url}
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={story.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <FiClock size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {mounted ? story.createdAt : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(story._id)}
                    className="text-slate-300 hover:text-red-600"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Viewer */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 z-[100] flex items-center justify-center p-8"
          >
            <div className="max-w-4xl w-full h-full flex flex-col">
              <button
                onClick={() => setSelectedStory(null)}
                className="self-end text-white p-3 border border-slate-800"
              >
                <FiX size={20} />
              </button>
              <div className="flex-1 bg-black border border-slate-800">
                {selectedStory.resource_type === 'video' ? (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Story;
