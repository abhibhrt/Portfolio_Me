'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import DSAHeader from './DSAHeader';
import DSAMain from './DSAMain';
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
    status: 'Solved' | 'Attempted' | 'Unsolved';
    code: { language: string; sourceCode: string; };
}

export default function ProblemsPage() {
    const [problems, setProblems] = useState<ProblemItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [monthOffset, setMonthOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [viewCode, setViewCode] = useState<ProblemItem | null>(null);
    const [tab, setTab] = useState<'code' | 'notes'>('code');

    useEffect(() => {
        verifyAuthAndFetchData();
    }, []);

    const verifyAuthAndFetchData = async () => {
        try {
            // Check if the user has an active session cookie
            const authRes = await axios.get('/api/dashboard/my-profile');
            if (authRes.data?.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            fetchProblems();
        }
    };

    const fetchProblems = async () => {
        try {
            setLoading(true);
            // Fetching from the public problems route
            const res = await axios.get('/api/problem');
            setProblems(res.data || []);
        } catch (error) {
            console.error("Failed to fetch problems from /api/problems:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProblemUpdate = (updatedProblem: ProblemItem) => {
        setProblems(prev => prev.map(p => p._id === updatedProblem._id ? updatedProblem : p));
    };

    return (
        <section className="relative py-24 pt-30 px-6 overflow-hidden min-h-screen">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header Section */}
                <DSAHeader 
                    problems={problems}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    monthOffset={monthOffset}
                    setMonthOffset={setMonthOffset}
                    isAuthenticated={isAuthenticated}
                />

                {/* Main Table & Category Accordion Section */}
                <DSAMain 
                    problems={problems}
                    loading={loading}
                    selectedDate={selectedDate}
                    isAuthenticated={isAuthenticated}
                    onProblemUpdate={handleProblemUpdate}
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
        </section>
    );
}