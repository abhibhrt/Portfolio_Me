'use client'

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiStar,
  FiX,
  FiLoader,
  FiCode,
  FiCheckCircle
} from 'react-icons/fi';
// Logos ke liye icons (SiLeetcode aur SiGeeksforgeeks install karna pad sakta hai, varna text fallback use kiya hai)
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';

interface ProblemItem {
  _id: string;
  problemName: string;
  date: string;
  platform: string;
  isRevisionRequired: boolean;
  note: string;
  problemUrl: string;
}

const PublicProblemsPage = () => {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('/api/problem');
        setProblems(res.data || []);
      } catch (error) {
        console.error("Vault access denied:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const activityData = useMemo(() => {
    const data: Record<string, number> = {};
    problems.forEach((item) => {
      data[item.date] = (data[item.date] || 0) + 1;
    });
    return data;
  }, [problems]);

  const getMonthInfo = (offset: number) => {
    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = current.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: (Date | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return { dates, monthName: current.toLocaleString('default', { month: 'long' }), year, isCurrentMonth: year === today.getFullYear() && month === today.getMonth() };
  };

  const { dates, monthName, year, isCurrentMonth } = getMonthInfo(monthOffset);
  const filteredProblems = selectedPlatform === 'All' ? problems : problems.filter((p) => p.platform === selectedPlatform);
  const platforms = ['All', ...new Set(problems.map((p) => p.platform))];

  // --- LOGO LOGIC ---
  const getPlatformIcon = (url: string) => {
    if (url.includes('leetcode.com')) return <SiLeetcode className="text-[#FFA116] transition-transform hover:scale-110 cursor-pointer" size={18} />;
    if (url.includes('geeksforgeeks.org')) return <SiGeeksforgeeks className="text-[#2F8D46] transition-transform hover:scale-110 cursor-pointer" size={18} />;
    return <FiCode className="text-slate-400 hover:text-white cursor-pointer" size={18} />;
  };

  return (
    <section className="relative min-h-screen bg-slate-950 pt-30 px-6 text-slate-300 font-mono">
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] tracking-[0.3em] mb-2">
              <span className="h-[1px] w-8 bg-emerald-500" /> abhibhrt/problems
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">Problem <span className="text-slate-500">Solving</span></h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {platforms.map((plat) => (
              <button key={plat} onClick={() => setSelectedPlatform(plat)} className={classNames('px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest border transition-all cursor-pointer', selectedPlatform === plat ? 'bg-emerald-600 border-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-800 text-slate-500 hover:border-slate-600')}>
                {plat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 border border-slate-800 bg-slate-900/20"><FiLoader className="animate-spin text-emerald-500 text-2xl" /><p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Syncing_Vault...</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- TABLE SECTION --- */}
            <div className="lg:col-span-9 bg-slate-900/30 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-800/50 border-b border-slate-800 px-6 py-3 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-100">Problems Solved</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Identity</th>
                      <th className="px-4 py-4 text-center">Platform</th>
                      <th className="px-4 py-4 text-center">Revision</th>
                      <th className="px-4 py-4 text-center">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredProblems.map((item) => (
                      <tr key={item._id} className="hover:bg-emerald-500/5 transition-colors group">
                        <td className="px-6 py-4 font-bold text-emerald-500 text-[9px] uppercase tracking-widest">Solved</td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-white font-bold uppercase tracking-tight">{item.problemName}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">{item.date}</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <a href={item.problemUrl} target="_blank" className="inline-flex items-center justify-center cursor-pointer transition-all">
                            {getPlatformIcon(item.problemUrl)}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.isRevisionRequired && <FiStar className="inline text-orange-400 fill-orange-400 animate-pulse" size={14} />}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.note && <button onClick={() => setActiveNote(item.note)} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><FiFileText size={16} /></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- CALENDAR SECTION --- */}
            <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800 p-4 self-start shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-mono text-[9px] text-white uppercase tracking-[0.1em]">{monthName} {year}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setMonthOffset(p => p - 1)} className="p-1 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-all"><FiChevronLeft size={12} /></button>
                  <button disabled={isCurrentMonth} onClick={() => setMonthOffset(p => p + 1)} className={classNames('p-1 border border-slate-800 transition-all cursor-pointer', isCurrentMonth ? 'opacity-20' : 'hover:bg-slate-800')}><FiChevronRight size={12} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (<div key={day} className="text-[8px] font-mono text-slate-600 text-center font-black">{day}</div>))}
                {dates.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
                  const hasSolved = activityData[dateStr];
                  return (
                    <div key={i} className={classNames('aspect-square flex items-center justify-center text-[9px] border transition-all duration-300', hasSolved ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-bold' : 'border-slate-800/50 text-slate-600')}>
                      {date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- NOTE MODAL --- */}
      <AnimatePresence>
        {activeNote && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 border border-slate-800 p-8 max-w-lg w-full relative">
              <button onClick={() => setActiveNote(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 cursor-pointer transition-colors"><FiX size={20} /></button>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase tracking-widest"><FiFileText /> Logic_Blueprint</div>
                <div className="h-[1px] w-full bg-slate-800" />
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans italic">"{activeNote}"</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PublicProblemsPage;