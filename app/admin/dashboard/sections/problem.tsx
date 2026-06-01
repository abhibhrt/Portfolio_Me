'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  FiTrash2, FiPlus, FiCheckCircle,
  FiArrowLeft, FiLoader, FiActivity, FiEdit, FiX 
} from 'react-icons/fi';
import { useAlert } from '@/app/hooks/useAlert';
import Link from 'next/link';

interface ProblemItem {
  _id?: string;
  problemName: string;
  date: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isRevisionRequired: boolean;
  note: string;
  problemUrl: string;
  code: {
    language: string;
    sourceCode: string;
  };
}

export default function AdminProblems() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const { showAlert } = useAlert();

  const initialForm: ProblemItem = {
    problemName: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Array',
    difficulty: 'Easy',
    isRevisionRequired: false,
    note: '',
    problemUrl: '',
    code: { language: 'C++', sourceCode: '' }
  };

  const [form, setForm] = useState<ProblemItem>(initialForm);

  // Saari unique categories fetch karna existing problems se
  const dynamicCategories = useMemo(() => {
    const categories = problems.map(p => p.category);
    const unique = Array.from(new Set(categories)).filter(Boolean);
    // Agar "Array" default hai aur list mein nahi hai, toh use add kar dete hain
    if (!unique.includes('Array')) unique.push('Array');
    return unique.sort();
  }, [problems]);

  useEffect(() => {
    const stored = window.localStorage.getItem('admin');
    if (!stored) { window.location.href = '/'; return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/problem');
      setProblems(res.data || []);
    } catch (err) { showAlert('Failed to fetch data', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await axios.put(`/api/problem?id=${editingId}`, form);
        setProblems(prev => prev.map(p => p._id === editingId ? res.data : p));
        showAlert('Problem updated', 'success');
      } else {
        const res = await axios.post('/api/problem', form);
        setProblems(prev => [res.data, ...prev]);
        showAlert('Problem saved', 'success');
      }
      resetForm();
    } catch (err) { showAlert('Operation failed', 'error'); }
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (problem: ProblemItem) => {
    setEditingId(problem._id || null);
    setForm({ ...problem });
    setIsOtherCategory(false); // Reset "Other" state on edit
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsOtherCategory(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`/api/problem?id=${id}`);
      setProblems(prev => prev.filter(p => p._id !== id));
      showAlert('Deleted successfully', 'success');
    } catch (err) { showAlert('Delete failed', 'error'); }
  };

  const inputStyle = "w-full p-2.5 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white outline-none focus:border-blue-500 transition-all";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 space-y-8">
      
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/problems" className="text-xs font-medium text-slate-500 hover:text-blue-400 flex items-center gap-2">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Admin Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
        {/* --- FORM SECTION --- */}
        <div className="lg:col-span-7">
          <section className="bg-slate-900 border border-slate-800 rounded-sm shadow-2xl">
            <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {editingId ? <FiEdit className="text-orange-400" /> : <FiPlus className="text-blue-400" />}
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {editingId ? 'Edit Problem' : 'Add New Problem'}
                </h3>
              </div>
              {editingId && (
                <button onClick={resetForm} className="cursor-pointer text-slate-400 hover:text-white"><FiX /></button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Problem Name</label>
                  <input value={form.problemName} onChange={e => setForm({...form, problemName: e.target.value})} required className={inputStyle} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Category</label>
                  {!isOtherCategory ? (
                    <select 
                      value={form.category} 
                      onChange={e => {
                        if (e.target.value === 'OTHER_OPTION') {
                          setIsOtherCategory(true);
                          setForm({...form, category: ''});
                        } else {
                          setForm({...form, category: e.target.value});
                        }
                      }} 
                      className={inputStyle}
                    >
                      {dynamicCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="OTHER_OPTION" className="text-blue-400 font-bold">+ Add New Category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        autoFocus
                        placeholder="Enter new category"
                        value={form.category} 
                        onChange={e => setForm({...form, category: e.target.value})} 
                        className={inputStyle} 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          setIsOtherCategory(false);
                          setForm({...form, category: dynamicCategories[0]});
                        }}
                        className="cursor-pointer p-2 bg-slate-700 hover:bg-slate-600 rounded-sm"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Problem URL</label>
                  <input value={form.problemUrl} onChange={e => setForm({...form, problemUrl: e.target.value})} required className={inputStyle} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Difficulty</label>
                  <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value as any})} className={inputStyle}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputStyle} />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Language</label>
                  <input value={form.code.language} onChange={e => setForm({...form, code: {...form.code, language: e.target.value}})} className={inputStyle} />
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isRevisionRequired} onChange={e => setForm({...form, isRevisionRequired: e.target.checked})} className="hidden" />
                    <div className={`w-5 h-5 border flex items-center justify-center ${form.isRevisionRequired ? 'bg-orange-600 border-orange-600' : 'border-slate-700 bg-slate-800'}`}>
                      {form.isRevisionRequired && <FiCheckCircle size={12} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold">Revision Needed</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Notes</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} className={`${inputStyle} h-25`} />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Source Code</label>
                <textarea value={form.code.sourceCode} onChange={e => setForm({...form, code: {...form.code, sourceCode: e.target.value}})} className={`${inputStyle} h-72 font-mono`} />
              </div>

              <button disabled={isSubmitting} className="cursor-pointer w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-xs font-bold uppercase tracking-widest transition-all">
                {isSubmitting ? 'Processing...' : editingId ? 'Update Record' : 'Save Problem'}
              </button>
            </form>
          </section>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 px-1 text-slate-500">
            <FiActivity size={14} /> <h4 className="text-xs font-bold uppercase tracking-widest">Recent Entries</h4>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
            {loading ? <div className="text-center py-10"><FiLoader className="animate-spin mx-auto" /></div> : 
              problems.map((p) => (
                <div key={p._id} className="group bg-slate-900 border border-slate-800 p-4 flex justify-between items-center hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-1 h-10 shrink-0 ${p.difficulty === 'Hard' ? 'bg-red-500' : p.difficulty === 'Medium' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                    <div className="truncate">
                      <h5 className="text-[13px] font-bold text-white truncate">{p.problemName}</h5>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{p.category} • {p.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEdit(p)} className="cursor-pointer p-2 text-slate-500 hover:text-blue-400 transition-all"><FiEdit size={16}/></button>
                    <button onClick={() => handleDelete(p._id!)} className="cursor-pointer p-2 text-slate-500 hover:text-red-500 transition-all"><FiTrash2 size={16}/></button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}