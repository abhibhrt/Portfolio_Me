'use client'

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { FiChevronDown, FiPlus } from 'react-icons/fi';
import PageHeader from '@/app/components/page-header';

interface ProblemItem {
    _id: string;
    date: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'Solved' | 'Attempted' | 'Unsolved';
}

interface ProgressProps {
    problems: ProblemItem[];
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    monthOffset: number;
    setMonthOffset: React.Dispatch<React.SetStateAction<number>>;
    isAdmin: boolean;
    onOpenAddModal: () => void;
}

interface CircularProgressRingProps {
    solved: number;
    total: number;
    label: string;
    strokeColor: string;
    trackColor: string;
    textColor: string;
    glowClass: string;
}

function CircularProgressRing({
    solved,
    total,
    label,
    strokeColor,
    trackColor,
    textColor,
    glowClass,
}: CircularProgressRingProps) {
    const size = 160;
    const strokeWidth = 9;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;
    const targetOffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto flex items-center justify-center rounded-full bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl group">
            {/* Subtle Ambient Glow */}
            <div
                className={classNames(
                    'absolute inset-2 sm:inset-3 rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none',
                    glowClass
                )}
            />

            <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]"
            >
                {/* Background Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />

                {/* Active Progress Arc */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: targetOffset }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
            </svg>

            {/* Center Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1 sm:px-2">
                <span className={classNames('font-mono text-sm sm:text-xl font-bold tracking-tight leading-none', textColor)}>
                    {solved}/{total}
                </span>
                <span className="text-[8px] sm:text-[10px] font-mono text-slate-300 uppercase tracking-wider sm:tracking-widest mt-1">
                    {label}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 mt-0.5">
                    {percentage}%
                </span>
            </div>
        </div>
    );
}

export default function Progress({
    problems,
    selectedDate,
    setSelectedDate,
    monthOffset,
    setMonthOffset,
    isAdmin,
    onOpenAddModal
}: ProgressProps) {

    const todayStr = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, []);

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
            {/* Common Header & Admin Action Button */}
            <PageHeader 
                name="DSA Modules" 
                path="abhibhrt/problems"
                action={
                    isAdmin && (
                        <button
                            onClick={onOpenAddModal}
                            className="cursor-pointer w-12 h-12 rounded-full bg-blue-600/30 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            title="Add New Problem"
                        >
                            <FiPlus size={22} />
                        </button>
                    )
                }
            />

            {/* Circular Stats & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Circular Progress Rings */}
                <div className="lg:col-span-8 grid grid-cols-3 gap-2.5 sm:gap-6">
                    <CircularProgressRing
                        solved={stats.Easy.solved}
                        total={stats.Easy.total}
                        label="Easy"
                        strokeColor="#34d399"
                        trackColor="rgba(16, 185, 129, 0.14)"
                        textColor="text-emerald-400"
                        glowClass="bg-emerald-500"
                    />

                    <CircularProgressRing
                        solved={stats.Medium.solved}
                        total={stats.Medium.total}
                        label="Medium"
                        strokeColor="#fbbf24"
                        trackColor="rgba(245, 158, 11, 0.14)"
                        textColor="text-amber-400"
                        glowClass="bg-amber-500"
                    />

                    <CircularProgressRing
                        solved={stats.Hard.solved}
                        total={stats.Hard.total}
                        label="Hard"
                        strokeColor="#fb7185"
                        trackColor="rgba(244, 63, 94, 0.14)"
                        textColor="text-rose-400"
                        glowClass="bg-rose-500"
                    />
                </div>

                {/* Calendar Widget */}
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
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => <div key={idx} className="text-[8px] font-bold text-slate-500 text-center font-mono">{d}</div>)}
                        {dates.map((date, i) => {
                            if (!date) return <div key={i} />;
                            const y = date.getFullYear();
                            const m = String(date.getMonth() + 1).padStart(2, '0');
                            const d = String(date.getDate()).padStart(2, '0');
                            const dStr = `${y}-${m}-${d}`;
                            const count = activityData[dStr] || 0;
                            const isToday = dStr === todayStr;
                            const isSelected = selectedDate === dStr;

                            return (
                                <div key={i}
                                    onClick={() => setSelectedDate(isSelected ? null : dStr)}
                                    title={count > 0 ? `${count} Problems Solved` : isToday ? 'Today' : ''}
                                    className={classNames(
                                        'aspect-square flex items-center justify-center text-[9px] font-mono rounded-full border transition-all cursor-pointer h-7 w-7 mx-auto',
                                        count > 0
                                            ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 font-bold'
                                            : isToday
                                                ? 'border-red-500 text-red-300 font-bold'
                                                : 'border-white/5 text-slate-500 hover:border-white/20',
                                        isToday && 'ring-1 ring-red-500',
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