'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiCode, FiTrash2, FiPlus, FiDatabase, 
  FiAlertCircle, FiCheckCircle, FiLink, 
  FiArrowLeft, FiLoader, FiActivity 
} from 'react-icons/fi';
import { useAlert } from '@/app/hooks/useAlert';
import Link from 'next/link';

interface ProblemItem {
  _id: string;
  problemName: string;
  date: string;
  platform: string;
  isRevisionRequired: boolean;
  note: string;
  problemUrl: string;
}

export default function AdminProblems() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  // Form State
  const [form, setForm] = useState({
    problemName: '',
    date: new Date().toISOString().split('T')[0],
    platform: 'LeetCode',
    isRevisionRequired: false,
    note: '',
    problemUrl: ''
  });

  useEffect(() => {
    // Admin Check
    const stored = window.localStorage.getItem('admin');
    if (!stored) {
        window.location.href = '/';
        return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/problem');
      setProblems(res.data || []);
    } catch (err) {
      showAlert('Vault Sync Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const stored = window.localStorage.getItem('admin');
    if (!stored) return {};
    const admin = JSON.parse(stored);
    return { Authorization: `Bearer ${admin.token}` };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.problemName || !form.problemUrl) {
      showAlert('Missing Required Parameters', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/problem', form, { headers: getAuthHeaders() });
      setProblems(prev => [res.data, ...prev]);
      // Reset only specific fields
      setForm({
        ...form,
        problemName: '',
        problemUrl: '',
        note: '',
        isRevisionRequired: false
      });
      showAlert('Log Deployed Successfully', 'success');
    } catch (err) {
      showAlert('Deployment Failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanent Purge? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/problem/${id}`, { headers: getAuthHeaders() });
      setProblems(prev => prev.filter(p => p._id !== id));
      showAlert('Data Purged', 'success');
    } catch (err) {
      showAlert('Purge Request Denied', 'error');
    }
  };

  const inputStyle = "w-full p-2.5 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 font-mono";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 mx-auto space-y-12">
      
      {/* --- TOP BAR --- */}
      <div className="flex justify-between items-center">
        <Link href="/problems" className="group text-[10px] font-mono text-slate-500 hover:text-blue-400 flex items-center gap-2 uppercase tracking-widest transition-all">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back_to_Archives
        </Link>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Admin_Session_Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- FORM SECTION (LEFT) --- */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-4 flex items-center gap-2">
              <FiDatabase className="text-blue-400" size={14} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-100 italic">
                Problem_Deployment_Terminal
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Problem_Title</label>
                  <input value={form.problemName} onChange={e => setForm({...form, problemName: e.target.value})} placeholder="e.g. Reverse Linked List" className={inputStyle} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Target_Platform</label>
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className={inputStyle}>
                    <option value="LeetCode">LeetCode</option>
                    <option value="GFG">GFG</option>
                    <option value="CodeStudio">CodeStudio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Source_URL</label>
                  <input value={form.problemUrl} onChange={e => setForm({...form, problemUrl: e.target.value})} placeholder="https://leetcode.com/..." className={inputStyle} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Execution_Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputStyle} />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.isRevisionRequired} onChange={e => setForm({...form, isRevisionRequired: e.target.checked})} className="hidden" />
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${form.isRevisionRequired ? 'bg-orange-600 border-orange-600' : 'border-slate-700 bg-slate-800'}`}>
                      {form.isRevisionRequired && <FiCheckCircle size={12} className="text-white" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${form.isRevisionRequired ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-400'}`}>Mark_for_Revision</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Logic_Notes (Optional)</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="Enter logic blueprint or edge cases..." className={`${inputStyle} h-28 resize-none`} />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button 
                  disabled={isSubmitting} 
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 active:scale-95"
                >
                  {isSubmitting ? 'SYNCING...' : 'EXECUTE_DEPLOYMENT'}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* --- RECENT LOGS (RIGHT) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <FiActivity className="text-slate-600" size={12} />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Recent_Terminal_Output</h4>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center border border-dashed border-slate-800">
                <FiLoader className="animate-spin mx-auto mb-2 text-slate-700" size={20} />
                <span className="text-[9px] font-mono text-slate-700 uppercase">Awaiting_Data...</span>
              </div>
            ) : problems.length > 0 ? (
              problems.map((p) => (
                <div key={p._id} className="group bg-slate-900 border border-slate-800 p-4 flex justify-between items-center hover:border-slate-600 transition-all shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-10 ${p.isRevisionRequired ? 'bg-orange-500' : 'bg-blue-600'} transition-colors shadow-[0_0_10px_rgba(37,99,235,0.2)]`} />
                    <div>
                      <h5 className="text-[11px] font-bold text-white uppercase truncate max-w-[200px]">{p.problemName}</h5>
                      <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-tighter">{p.platform} • {p.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(p._id)}
                    className="p-2.5 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                    title="Purge Record"
                  >
                    <FiTrash2 size={14}/>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center border border-slate-800 text-slate-700 font-mono text-[9px] uppercase">
                LOGS_EMPTY
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}