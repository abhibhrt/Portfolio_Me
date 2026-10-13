'use client'

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';

interface ProblemItem {
    _id: string;
    date: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Solved' | 'Attempted' | 'Unsolved';
}

interface DSAHeaderProps {
    problems: ProblemItem[];
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    monthOffset: number;
    setMonthOffset: React.Dispatch<React.SetStateAction<number>>;
    isAuthenticated: boolean;
}

export default function DSAHeader({
    problems,
    selectedDate,
    setSelectedDate,
    monthOffset,
    setMonthOffset,
    isAuthenticated
}: DSAHeaderProps) {

    // Activity Data for Calendar
    const activityData = useMemo(() => {
        const data: Record<string, number> = {};
        problems.forEach((item) => {
            if (item.date && item.status === 'Solved') {
                const d = item.date.split('T')[0];
                data[d] = (data[d] || 0) + 1;
            }
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

    // Difficulty Stats (Total & Solved)
    const stats = useMemo(() => {
        const counts = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
        problems.forEach(p => {
            if (counts[p.difficulty]) {
                counts[p.difficulty].total++;
                if (p.status === 'Solved') counts[p.difficulty].solved++;
            }
        });
        return counts;
    }, [problems]);

    return (
        <div className="space-y-12">
            {/* Header & Admin Mode Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-[10px] tracking-[0.3em] mb-2">
                        <span className="h-[1px] w-8 bg-blue-400" />
                        abhibhrt/problems
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">
                        DSA <span className="text-slate-500">Modules</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-lg text-xs font-mono">
                    <span className="text-slate-400">Mode:</span>
                    {isAuthenticated ? 'ADMIN' : 'GUEST'}
                </div>
            </div>

            {/* Circular Stats & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Circular Cards */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="relative w-36 h-36 mx-auto rounded-full border-4 border-emerald-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl shadow-xl">
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
                        <span className="text-emerald-400 font-mono text-xl font-bold">{stats.Easy.solved}/{stats.Easy.total}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Easy</span>
                    </div>

                    <div className="relative w-36 h-36 mx-auto rounded-full border-4 border-amber-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl shadow-xl">
                        <div className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
                        <span className="text-amber-400 font-mono text-xl font-bold">{stats.Medium.solved}/{stats.Medium.total}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Medium</span>
                    </div>

                    <div className="relative w-36 h-36 mx-auto rounded-full border-4 border-rose-500/30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl shadow-xl">
                        <div className="absolute inset-0 rounded-full border-4 border-rose-400 border-t-transparent animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
                        <span className="text-rose-400 font-mono text-xl font-bold">{stats.Hard.solved}/{stats.Hard.total}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Hard</span>
                    </div>
                </div>

                {/* Balanced Calendar Widget */}
                <div className="lg:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-lg shadow-xl max-w-[320px] mx-auto w-full">
                    <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                        <h3 className="text-[10px] font-bold text-white font-mono uppercase tracking-wider">{monthName} {year}</h3>
                        <div className="flex items-center gap-2">
                            {selectedDate && (
                                <button onClick={() => setSelectedDate(null)} className="text-[9px] text-blue-400 hover:text-blue-300 font-mono uppercase">
                                    Clear
                                </button>
                            )}
                            <div className="flex gap-1">
                                <button onClick={() => setMonthOffset(p => p - 1)} className="p-1 border border-white/10 hover:bg-white/10 rounded-sm cursor-pointer transition-all"><FiChevronDown size={12} className="rotate-90" /></button>
                                <button disabled={isCurrentMonth} onClick={() => setMonthOffset(p => p + 1)} className="p-1 border border-white/10 hover:bg-white/10 disabled:opacity-20 rounded-sm cursor-pointer transition-all"><FiChevronDown size={12} className="-rotate-90" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[8px] font-bold text-slate-500 text-center font-mono">{d}</div>)}
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
                                        'aspect-square flex items-center justify-center text-[9px] font-mono rounded-full border transition-all cursor-pointer h-7 w-7 mx-auto',
                                        count > 0 ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 font-bold' : 'border-white/5 text-slate-500 hover:border-white/20',
                                        isSelected && 'ring-1 ring-blue-400 ring-offset-1 ring-offset-black'
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
    );
}