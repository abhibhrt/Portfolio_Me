'use client';

import { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  FiTrash2,
  FiUploadCloud,
  FiDatabase,
  FiLayers,
  FiX,
  FiGithub,
  FiExternalLink,
  FiCalendar,
} from 'react-icons/fi';
import { useAlert } from '@/app/hooks/useAlert';
import { motion } from 'framer-motion';

interface ProjectItem {
  _id: string;
  url: string;
  title: string;
  features: string;
  description: string;
  github: string;
  visit: string;
  projectDate: string;
  createdAt: string;
}

interface AdminPayload {
  token?: string;
}

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { showAlert } = useAlert();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [features, setFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [github, setGithub] = useState('');
  const [visit, setVisit] = useState('');
  const [projectDate, setProjectDate] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('admin');
      if (stored) {
        try {
          const parsed: AdminPayload = JSON.parse(stored);
          if (parsed?.token) setIsAdmin(true);
        } catch {}
      }
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<ProjectItem[]> = await axios.get('/api/projects');
      setProjects(res.data ?? []);
    } catch {
      showAlert('Project sync failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const resetForm = () => {
    setTitle('');
    setFeatures('');
    setDescription('');
    setGithub('');
    setVisit('');
    setProjectDate('');
    setSelectedFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const stored = window.localStorage.getItem('admin');
    if (!stored) return {};
    try {
      const admin: AdminPayload = JSON.parse(stored);
      return admin?.token ? { Authorization: `Bearer ${admin.token}` } : {};
    } catch { return {}; }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || !title || !description || !projectDate) {
      showAlert('All required fields must be filled', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('features', features);
    formData.append('description', description);
    formData.append('github', github);
    formData.append('visit', visit);
    formData.append('projectDate', projectDate);

    setUploading(true);
    try {
      const res: AxiosResponse<ProjectItem> = await axios.post(
        '/api/projects',
        formData,
        { headers: getAuthHeaders() }
      );
      setProjects(prev => [res.data, ...prev]);
      resetForm();
      showAlert('Project deployed successfully', 'success');
    } catch (err: any) {
      showAlert(err?.response?.data?.message || 'Deployment failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanent deletion of this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`, { headers: getAuthHeaders() });
      setProjects(prev => prev.filter(p => p._id !== id));
      showAlert('Project purged', 'success');
    } catch {
      showAlert('Purge failed', 'error');
    }
  };

  if (!mounted) return null;

  const inputStyle = "w-full p-2 bg-slate-800 border border-slate-700 rounded-sm text-sm focus:outline-none focus:border-blue-500 text-white placeholder:text-slate-500 transition-colors";

  return (
    <div className="space-y-12 min-h-screen p-6 text-slate-200">
      {isAdmin && (
        <section className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-2xl">
          <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-3 flex items-center gap-2">
            <FiDatabase className="text-blue-400" size={14} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-100">
              Project Deployment Terminal
            </h3>
          </div>

          <form onSubmit={handleUpload} className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 relative min-h-[200px]">
              {!preview ? (
                <label className="w-full h-full border-2 border-dashed border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center bg-slate-800/30 cursor-pointer rounded-sm transition-all group">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <FiUploadCloud className="text-2xl text-slate-500 group-hover:text-blue-400 transition-colors cursor-pointer" />
                  <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 cursor-pointer">
                    Upload Cover
                  </span>
                </label>
              ) : (
                <div className="relative h-full w-full rounded-sm overflow-hidden border border-slate-700">
                  <img src={preview} className="w-full h-full object-cover" alt="preview" />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className={inputStyle} />
                <input value={features} onChange={e => setFeatures(e.target.value)} placeholder="Features" className={inputStyle} />
                <input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub URL" className={inputStyle} />
                <input value={visit} onChange={e => setVisit(e.target.value)} placeholder="Live URL" className={inputStyle} />
                <div className="md:col-span-2 flex items-center gap-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Release Date:</span>
                  <input type="date" value={projectDate} onChange={e => setProjectDate(e.target.value)} className={`${inputStyle} cursor-pointer`} />
                </div>
              </div>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Project Description" className={`${inputStyle} min-h-[100px] resize-none`} />
            </div>

            <div className="lg:col-span-4 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Reset Fields
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] disabled:bg-slate-800 disabled:text-slate-600 transition-all shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                {uploading ? 'Processing...' : 'Deploy Project'}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project._id}
            layout
            className="group bg-slate-900 border border-slate-800 rounded-sm overflow-hidden hover:border-slate-600 transition-all flex flex-col"
          >
            <div className="relative overflow-hidden">
              <img
                src={project.url}
                alt={project.title}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {isAdmin && (
                <button
                  onClick={() => handleDelete(project._id)}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <FiTrash2 size={12} />
                </button>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-[12px] font-black uppercase tracking-tight text-white truncate max-w-[70%]">
                  {project.title || 'Unnamed Project'}
                </h4>
                <div className="flex gap-2">
                  {project.github && <a href={project.github} target="_blank" className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"><FiGithub size={12}/></a>}
                  {project.visit && <a href={project.visit} target="_blank" className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"><FiExternalLink size={12}/></a>}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                <span className="text-[8px] text-slate-500 uppercase font-mono">
                  {project.projectDate ? new Date(project.projectDate).toLocaleDateString() : 'N/A'}
                </span>
                <span className="text-[8px] text-slate-700 uppercase font-mono">MOD_0{idx + 1}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;