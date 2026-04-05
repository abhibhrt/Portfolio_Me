'use client'

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiStar, FiLoader, FiCode, FiCheckCircle, FiFileText, FiX
} from 'react-icons/fi';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';
import { CodeModal } from './CodeBlock';

interface ProblemItem {
  _id: string;
  problemName: string;
  date: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isRevisionRequired: boolean;
  note: string;
  problemUrl: string;
  code: { language: string; sourceCode: string; };
}

export default function PublicProblemsPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewCode, setViewCode] = useState<ProblemItem | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('/api/problem');
        setProblems(res.data || []);
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const activityData = useMemo(() => {
    const data: Record<string, number> = {};
    problems.forEach((item) => {
      const d = item.date.split('T')[0];
      data[d] = (data[d] || 0) + 1;
    });
    return data;
  }, [problems]);

  const getMonthInfo = (offset: number) => {
    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = current.getDay();
    const dates: (Date | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) dates.push(new Date(year, month, i));
    return { dates, monthName: current.toLocaleString('default', { month: 'long' }), year, isCurrentMonth: year === today.getFullYear() && month === today.getMonth() };
  };

  const { dates, monthName, year, isCurrentMonth } = getMonthInfo(monthOffset);
  const categories = ['All', ...new Set(problems.map(p => p.category))];
  
  const filteredProblems = useMemo(() => {
    let filtered = problems;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedDate) {
      filtered = filtered.filter(p => p.date.split('T')[0] === selectedDate);
    }
    return filtered;
  }, [problems, selectedCategory, selectedDate]);

  const getPlatformIcon = (url: string) => {
    if (url.includes('leetcode.com')) return <SiLeetcode className="text-[#FFA116]" size={18} />;
    if (url.includes('geeksforgeeks.org')) return <SiGeeksforgeeks className="text-[#2F8D46]" size={18} />;
    return <FiCode className="text-slate-400" size={18} />;
  };

  return (
    <section className="relative bg-slate-950 py-24 pt-30 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="mb-16 space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] tracking-[0.3em]">
              <span className="h-[1px] w-8 bg-blue-500" />
              abhibhrt/problems
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
              DSA <span className="text-slate-500">Problems</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={classNames('px-4 py-1.5 text-[10px] font-bold uppercase border transition-all cursor-pointer', selectedCategory === cat ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-600')}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center border border-slate-900 bg-slate-900/10"><FiLoader className="animate-spin text-blue-500 text-2xl mb-2" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9 bg-slate-900/20 border border-slate-900 rounded-sm overflow-hidden shadow-2xl">
              <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" size={14} />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-100">
                    {selectedDate ? `Solved on ${selectedDate}` : 'Solved Entries'}
                  </h3>
                </div>
                {selectedDate && (
                  <button 
                    onClick={() => setSelectedDate(null)}
                    className="flex items-center gap-1 text-[9px] text-blue-400 hover:text-blue-300 transition-colors uppercase font-bold"
                  >
                    <FiX size={12}/> Clear Date Filter
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Title & Details</th>
                      <th className="px-4 py-4 text-center">Difficulty</th>
                      <th className="px-4 py-4 text-center">Platform</th>
                      <th className="px-4 py-4 text-center">Revision</th>
                      <th className="px-4 py-4 text-center">Notes</th>
                      <th className="px-4 py-4 text-center">Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredProblems.length > 0 ? filteredProblems.map((item) => (
                      <tr key={item._id} className="hover:bg-blue-600/5 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="text-sm text-white font-bold">{item.problemName}</div>
                          <div className="text-[10px] text-slate-500 uppercase mt-1 font-medium tracking-tight">
                            {item.category} • {item.date.split('T')[0]} • {item.code.language}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={classNames('text-[9px] font-bold px-2 py-0.5 rounded-sm border', item.difficulty === 'Easy' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : item.difficulty === 'Medium' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5')}>
                            {item.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <a href={item.problemUrl} target="_blank" className="hover:scale-110 inline-block transition-transform">{getPlatformIcon(item.problemUrl)}</a>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.isRevisionRequired ? (
                            <FiStar className="inline text-orange-400 fill-orange-400 animate-pulse" size={14} title="Revision Needed" />
                          ) : (
                            <span className="text-slate-800 text-[9px]">--</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {item.note ? (
                            <button onClick={() => setViewCode(item)} className="text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
                              <FiFileText size={16} />
                            </button>
                          ) : (
                            <span className="text-slate-800 text-[9px]">--</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button onClick={() => setViewCode(item)} className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all rounded-sm cursor-pointer shadow-lg group-hover:scale-105">
                            <FiCode size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-slate-600 text-xs font-medium uppercase tracking-widest">
                          No entries found for this selection
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="bg-slate-900/20 border border-slate-900 p-5 rounded-sm h-fit shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">{monthName} {year}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => setMonthOffset(p => p - 1)} className="p-1 border border-slate-800 hover:bg-slate-800 cursor-pointer transition-all"><FiChevronLeft size={14} /></button>
                    <button disabled={isCurrentMonth} onClick={() => setMonthOffset(p => p + 1)} className="p-1 border border-slate-800 hover:bg-slate-800 disabled:opacity-20 cursor-pointer transition-all"><FiChevronRight size={14} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[8px] font-bold text-slate-700 text-center">{d}</div>)}
                  {dates.map((date, i) => {
                    if (!date) return <div key={i} />;
                    
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const d = String(date.getDate()).padStart(2, '0');
                    const dStr = `${y}-${m}-${d}`;
                    
                    const count = activityData[dStr] || 0;
                    const isSelected = selectedDate === dStr;

                    return (
                      <div key={i}
                        onClick={() => setSelectedDate(isSelected ? null : dStr)}
                        title={count > 0 ? `${count} Problems Solved` : ''}
                        className={classNames(
                          'aspect-square flex items-center justify-center text-[9px] rounded-full border transition-all cursor-pointer',
                          count > 0 ? 'bg-green-600/20 border-green-500/50 text-green-400 font-bold' : 'border-slate-800/30 text-slate-700 hover:border-slate-600',
                          isSelected && 'ring-1 ring-blue-500 ring-offset-2 ring-offset-slate-950'
                        )}
                      >
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewCode && <CodeModal problem={viewCode} onClose={() => setViewCode(null)} />}
      </AnimatePresence>
    </section>
  );
}