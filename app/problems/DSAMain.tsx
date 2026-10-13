'use client'

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiChevronDown, FiChevronRight, FiStar, FiLoader, FiCode, FiCheckCircle, FiFileText, FiClock, FiAlertCircle, FiEdit3, FiX
} from 'react-icons/fi';
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';

interface ProblemItem {
    _id: string;
    problemName: string;
    date: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isRevisionRequired: boolean;
    note: string;
    problemUrl: string;
    status: 'Solved' | 'Attempted' | 'Unsolved';
    code: { language: string; sourceCode: string; };
}

interface DSAMainProps {
    problems: ProblemItem[];
    loading: boolean;
    selectedDate: string | null;
    isAuthenticated: boolean;
    onProblemUpdate: (updatedProblem: ProblemItem) => void;
    setViewCode: (problem: ProblemItem | null) => void;
    setTab: (tab: 'code' | 'notes') => void;
}

export default function DSAMain({
    problems,
    loading,
    selectedDate,
    isAuthenticated,
    onProblemUpdate,
    setViewCode,
    setTab
}: DSAMainProps) {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [editModalProblem, setEditModalProblem] = useState<ProblemItem | null>(null);

    const categorizedProblems = useMemo(() => {
        let filtered = problems;
        if (selectedDate) {
            filtered = problems.filter(p => p.date && p.date.split('T')[0] === selectedDate);
        }

        const groups: Record<string, ProblemItem[]> = {};
        filtered.forEach(p => {
            const cat = p.category || 'General';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });
        return groups;
    }, [problems, selectedDate]);

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const handleOpenModal = (item: ProblemItem, tabType: 'code' | 'notes') => {
        setTab(tabType);
        setViewCode(item);
    };

    const handleStatusChange = async (id: string, newStatus: 'Solved' | 'Attempted' | 'Unsolved') => {
        if (!isAuthenticated) return;
        try {
            setUpdatingId(id);
            const res = await axios.put(`/api/dashboard/problems?id=${id}`, { status: newStatus });
            if (res.data) {
                onProblemUpdate(res.data);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSaveProblem = async (updated: ProblemItem) => {
        try {
            const res = await axios.put(`/api/dashboard/problems?id=${updated._id}`, updated);
            if (res.data) {
                onProblemUpdate(res.data);
            }
            setEditModalProblem(null);
        } catch (error) {
            console.error("Failed to update problem:", error);
        }
    };

    const getPlatformIcon = (url: string) => {
        if (!url) return <FiCode className="text-slate-400" size={16} />;
        if (url.includes('leetcode.com')) return <SiLeetcode className="text-[#FFA116]" size={16} />;
        if (url.includes('geeksforgeeks.org')) return <SiGeeksforgeeks className="text-[#2F8D46]" size={16} />;
        return <FiCode className="text-slate-400" size={16} />;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Solved':
                return <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm"><FiCheckCircle size={10} /> Solved</span>;
            case 'Attempted':
                return <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm"><FiClock size={10} /> Attempted</span>;
            default:
                return <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm"><FiAlertCircle size={10} /> Unsolved</span>;
        }
    };

    return (
        <>
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center border border-white/10 bg-black/40 backdrop-blur-xl rounded-lg">
                    <FiLoader className="animate-spin text-blue-400 text-2xl mb-2" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Loading Modules...</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.keys(categorizedProblems).length > 0 ? (
                        Object.entries(categorizedProblems).map(([category, items]) => {
                            const isExpanded = !!expandedCategories[category];
                            const solvedCount = items.filter(i => i.status === 'Solved').length;

                            return (
                                <div key={category} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl transition-all">
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            {isExpanded ? <FiChevronDown className="text-blue-400" size={18} /> : <FiChevronRight className="text-slate-400" size={18} />}
                                            <span className="text-sm font-bold text-white font-mono uppercase tracking-wider">{category}</span>
                                            <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm">
                                                Solved: {solvedCount} / Total: {items.length}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-slate-500">{items.length} items</span>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-white/10 overflow-x-auto"
                                            >
                                                <table className="w-full text-left border-collapse">
                                                    <thead className="bg-black/60 border-b border-white/10 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                                        <tr>
                                                            <th className="px-6 py-4">Title & Details</th>
                                                            <th className="px-4 py-4 text-center">Difficulty</th>
                                                            <th className="px-4 py-4 text-center">Platform</th>
                                                            <th className="px-4 py-4 text-center">Status</th>
                                                            <th className="px-4 py-4 text-center">Revision</th>
                                                            <th className="px-4 py-4 text-center">Notes</th>
                                                            <th className="px-4 py-4 text-center">Code / Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5">
                                                        {items.map((item) => (
                                                            <tr key={item._id} className="hover:bg-blue-600/5 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-white font-bold">{item.problemName}</div>
                                                                    <div className="text-[10px] text-slate-400 font-mono uppercase mt-1">
                                                                        {item.date ? item.date.split('T')[0] : 'N/A'} • {item.code?.language || 'Code'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    <span className={classNames('text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase font-mono', 
                                                                        item.difficulty === 'Easy' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
                                                                        item.difficulty === 'Medium' ? 'text-orange-400 border-orange-500/20 bg-orange-500/5' : 
                                                                        'text-red-400 border-red-500/20 bg-red-500/5'
                                                                    )}>
                                                                        {item.difficulty}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    <a href={item.problemUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 inline-block transition-transform">
                                                                        {getPlatformIcon(item.problemUrl)}
                                                                    </a>
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    {isAuthenticated ? (
                                                                        <select
                                                                            value={item.status || 'Unsolved'}
                                                                            disabled={updatingId === item._id}
                                                                            onChange={(e) => handleStatusChange(item._id, e.target.value as any)}
                                                                            className="bg-black/60 border border-white/10 text-white text-[10px] font-mono uppercase px-2 py-1 rounded-sm focus:outline-none focus:border-blue-400 cursor-pointer"
                                                                        >
                                                                            <option value="Solved">Solved</option>
                                                                            <option value="Attempted">Attempted</option>
                                                                            <option value="Unsolved">Unsolved</option>
                                                                        </select>
                                                                    ) : (
                                                                        getStatusBadge(item.status || 'Unsolved')
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    {item.isRevisionRequired ? (
                                                                        <FiStar className="inline text-orange-400 fill-orange-400 animate-pulse" size={14} title="Revision Needed" />
                                                                    ) : (
                                                                        <span className="text-slate-700 text-[9px]">--</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    {item.note ? (
                                                                        <button 
                                                                            onClick={() => handleOpenModal(item, 'notes')} 
                                                                            className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer" 
                                                                            title="View Notes"
                                                                        >
                                                                            <FiFileText size={16} />
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-slate-700 text-[9px]">--</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button 
                                                                            onClick={() => handleOpenModal(item, 'code')} 
                                                                            className="p-2 bg-white/5 border border-white/10 hover:bg-blue-600 text-slate-400 hover:text-white transition-all rounded-sm cursor-pointer shadow-lg" 
                                                                            title="View Code"
                                                                        >
                                                                            <FiCode size={14} />
                                                                        </button>
                                                                        {isAuthenticated && (
                                                                            <button 
                                                                                onClick={() => setEditModalProblem(item)} 
                                                                                className="p-2 bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600 text-blue-400 hover:text-white transition-all rounded-sm cursor-pointer" 
                                                                                title="Edit Problem"
                                                                            >
                                                                                <FiEdit3 size={14} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-lg bg-black/20 backdrop-blur-md">
                            <span className="text-[10px] font-mono uppercase text-slate-500">No_DSA_Entries_Found</span>
                        </div>
                    )}
                </div>
            )}

            {/* Admin Edit Modal */}
            <AnimatePresence>
                {editModalProblem && (
                    <EditProblemModal 
                        problem={editModalProblem} 
                        onClose={() => setEditModalProblem(null)} 
                        onSave={handleSaveProblem} 
                    />
                )}
            </AnimatePresence>
        </>
    );
}

function EditProblemModal({ problem, onClose, onSave }: { problem: ProblemItem; onClose: () => void; onSave: (p: ProblemItem) => void }) {
    const [formData, setFormData] = useState<ProblemItem>({ ...problem });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-white/10 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Edit Problem: {formData.problemName}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><FiX size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Notes</label>
                        <textarea 
                            rows={3}
                            value={formData.note || ''}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white text-xs mt-1 focus:outline-none focus:border-blue-400 font-mono"
                            placeholder="Add your approach or notes..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-mono text-slate-400 uppercase">Language</label>
                            <input 
                                type="text"
                                value={formData.code?.language || ''}
                                onChange={(e) => setFormData({ ...formData, code: { ...formData.code, language: e.target.value } })}
                                className="w-full bg-black/50 border border-white/10 rounded-sm p-2 text-white text-xs mt-1 focus:outline-none focus:border-blue-400 font-mono"
                                placeholder="e.g., C++, TypeScript"
                            />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input 
                                type="checkbox"
                                id="revision"
                                checked={formData.isRevisionRequired}
                                onChange={(e) => setFormData({ ...formData, isRevisionRequired: e.target.checked })}
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                            />
                            <label htmlFor="revision" className="text-xs font-mono text-white cursor-pointer uppercase">Revision Required</label>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase">Source Code</label>
                        <textarea 
                            rows={6}
                            value={formData.code?.sourceCode || ''}
                            onChange={(e) => setFormData({ ...formData, code: { ...formData.code, sourceCode: e.target.value } })}
                            className="w-full bg-black/50 border border-white/10 rounded-sm p-3 text-white text-xs font-mono mt-1 focus:outline-none focus:border-blue-400"
                            placeholder="Paste your solution code here..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-white/10 text-slate-400 text-xs font-mono uppercase hover:bg-white/5 rounded-sm">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono uppercase rounded-sm shadow-lg">Save Changes</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}