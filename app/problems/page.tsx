'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import Progress from './problems-progress';
import DSAProblems from './problem-main';
import { CodeModal } from './CodeBlock';
import AddProblemModal from './add-problem-modal';
import { useAuthStore } from '@/app/store/useAuthStore';

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

export default function ProblemsPage() {
    const [problems, setProblems] = useState<ProblemItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [viewCode, setViewCode] = useState<ProblemItem | null>(null);
    const [tab, setTab] = useState<'code' | 'notes'>('code');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { isAdmin } = useAuthStore();

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/problem');
            setProblems(res.data || []);
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    // Extract unique categories from current problems list
    const existingCategories = useMemo(() => {
        const cats = new Set<string>();
        problems.forEach(p => {
            if (p.category) cats.add(p.category);
        });
        return Array.from(cats);
    }, [problems]);

    const handleProblemUpdate = (updatedProblem: ProblemItem) => {
        setProblems(prev => prev.map(p => p._id === updatedProblem._id ? updatedProblem : p));
    };

    const handleProblemDelete = (deletedId: string) => {
        setProblems(prev => prev.filter(p => p._id !== deletedId));
    };

    return (
        <section className="relative py-24 pt-30 px-6 overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header Section */}
                <Progress 
                    problems={problems}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    monthOffset={monthOffset}
                    setMonthOffset={setMonthOffset}
                    isAdmin={isAdmin}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                />

                {/* Main Table & Category Accordion Section */}
                <DSAProblems 
                    problems={problems}
                    loading={loading}
                    selectedDate={selectedDate}
                    isAuthenticated={isAdmin}
                    onProblemUpdate={handleProblemUpdate}
                    onProblemDelete={handleProblemDelete}
                    setViewCode={setViewCode}
                    setTab={setTab}
                />
            </div>

            {/* Code / Notes Modal */}
            <AnimatePresence>
                {viewCode && (
                    <CodeModal 
                        problem={viewCode} 
                        initialTab={tab} 
                        onClose={() => setViewCode(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Add Problem Modal */}
            <AddProblemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchProblems}
                existingCategories={existingCategories}
            />
        </section>
    );
}