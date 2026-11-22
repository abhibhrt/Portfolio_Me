'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '@/app/components/page-header'
import {
  FiHome,
  FiHeart,
  FiShield,
  FiUser,
  FiPieChart,
  FiSearch,
  FiInfo,
} from 'react-icons/fi'

type BudgetCategory = 'Housing & Deposit' | 'Family & Commute' | 'Savings & Funds' | 'Personal & Buffer'

interface BudgetItem {
  id: string
  name: string
  amount: number
  category: BudgetCategory
  tag: string
  note?: string
}

const TOTAL_SALARY = 24665

const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'pg-rent',
    name: 'PG Rent',
    amount: 6500,
    category: 'Housing & Deposit',
    tag: 'Monthly Fixed',
  },
  {
    id: 'pg-deposit',
    name: 'PG Security Deposit (one-time)',
    amount: 2000,
    category: 'Housing & Deposit',
    tag: 'One-Time',
    note: 'December special · Refundable / one-time outflow',
  },
  {
    id: 'ghar-bhejna',
    name: 'Ghar bhejna',
    amount: 8000,
    category: 'Family & Commute',
    tag: 'Family',
  },
  {
    id: 'office-travel',
    name: 'Office travelling',
    amount: 500,
    category: 'Family & Commute',
    tag: 'Commute',
  },
  {
    id: 'emi-sbi',
    name: 'EMI (SBI)',
    amount: 1317,
    category: 'Savings & Funds',
    tag: 'SBI · Loan/EMI',
  },
  {
    id: 'icici-darjeeling',
    name: 'ICICI – Darjeeling RD',
    amount: 1500,
    category: 'Savings & Funds',
    tag: 'ICICI · Travel RD',
  },
  {
    id: 'sbi-savings-rd',
    name: 'SBI – Savings RD',
    amount: 2000,
    category: 'Savings & Funds',
    tag: 'SBI · Recurring',
  },
  {
    id: 'kotak-health',
    name: 'Kotak – Health Fund',
    amount: 500,
    category: 'Savings & Funds',
    tag: 'Kotak · Medical',
  },
  {
    id: 'personal-expenses',
    name: 'Personal Expenses',
    amount: 2000,
    category: 'Personal & Buffer',
    tag: 'Lifestyle',
  },
  {
    id: 'hdfc-mobile-buffer',
    name: 'HDFC – Mobile Fund / Buffer',
    amount: 348,
    category: 'Personal & Buffer',
    tag: 'HDFC · Buffer',
  },
]

const CATEGORIES: ('All' | BudgetCategory)[] = [
  'All',
  'Housing & Deposit',
  'Family & Commute',
  'Savings & Funds',
  'Personal & Buffer',
]

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BudgetPage() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BudgetCategory>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const totals = useMemo(() => {
    const allocated = BUDGET_ITEMS.reduce((sum, item) => sum + item.amount, 0)
    const oneTime = BUDGET_ITEMS.find((i) => i.id === 'pg-deposit')?.amount ?? 0
    const savingsAndFunds = BUDGET_ITEMS.filter((i) => i.category === 'Savings & Funds').reduce(
      (sum, item) => sum + item.amount,
      0
    )
    const recurringLiving = allocated - oneTime
    const remaining = TOTAL_SALARY - allocated

    return { allocated, oneTime, savingsAndFunds, recurringLiving, remaining }
  }, [])

  const categoryBreakdown = useMemo(() => {
    const map: Record<BudgetCategory, number> = {
      'Housing & Deposit': 0,
      'Family & Commute': 0,
      'Savings & Funds': 0,
      'Personal & Buffer': 0,
    }
    BUDGET_ITEMS.forEach((item) => {
      map[item.category] += item.amount
    })
    return map
  }, [])

  const filteredItems = useMemo(() => {
    return BUDGET_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const getCategoryIcon = (category: BudgetCategory) => {
    switch (category) {
      case 'Housing & Deposit':
        return <FiHome className="text-blue-400" size={15} />
      case 'Family & Commute':
        return <FiHeart className="text-rose-400" size={15} />
      case 'Savings & Funds':
        return <FiShield className="text-emerald-400" size={15} />
      case 'Personal & Buffer':
        return <FiUser className="text-amber-400" size={15} />
    }
  }

  return (
    <section className="relative min-h-screen py-24 pt-30 px-6 overflow-hidden text-white">
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        <PageHeader
          name="Monthly Budget"
          path="abhibhrt/budget"
          action={
            <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[10px] uppercase tracking-widest">
              December Special · Security Deposit Included
            </span>
          }
        />

        {/* Top Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Total Monthly Salary
            </p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-white mt-2">
              {formatINR(TOTAL_SALARY)}
            </p>
            <p className="text-[11px] font-mono text-blue-400 mt-1.5">
              100% Allocated · {formatINR(totals.remaining)} Left
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Savings, RDs & Funds
            </p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-2">
              {formatINR(totals.savingsAndFunds)}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1.5">
              {Math.round((totals.savingsAndFunds / TOTAL_SALARY) * 100)}% of monthly salary
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              One-Time Deposit (Dec)
            </p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-2">
              {formatINR(totals.oneTime)}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1.5">
              PG Security Deposit included
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-5 shadow-xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Total Planned Outflow
            </p>
            <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 mt-2">
              {formatINR(totals.allocated)}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-1.5">
              {BUDGET_ITEMS.length} tracked line items
            </p>
          </div>
        </div>

        {/* Category Distribution Bars */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FiPieChart className="text-blue-400" size={16} />
              <h3 className="text-xs font-mono uppercase tracking-widest text-white">
                Allocation Breakdown
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Base: {formatINR(TOTAL_SALARY)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(categoryBreakdown) as BudgetCategory[]).map((cat) => {
              const amount = categoryBreakdown[cat]
              const pct = Math.round((amount / TOTAL_SALARY) * 100)
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-slate-200">
                      {getCategoryIcon(cat)}
                      {cat}
                    </span>
                    <span className="text-white font-semibold">
                      {formatINR(amount)}{' '}
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                      : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search expense or bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 focus:border-blue-400 rounded-sm text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Expense Table */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/60 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  <th className="py-3.5 px-5">Expense</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Share</th>
                  <th className="py-3.5 px-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredItems.map((item) => {
                  const share = ((item.amount / TOTAL_SALARY) * 100).toFixed(1)
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-white">
                            {item.name}
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 text-slate-300 border border-white/10">
                            {item.tag}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-[11px] font-mono text-amber-300/80 mt-1">
                            {item.note}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5 text-xs font-mono text-slate-300">
                        <span className="inline-flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs font-mono text-slate-400">
                        {share}%
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-semibold text-white">
                        {formatINR(item.amount)}
                      </td>
                    </tr>
                  )
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 px-5 text-center text-xs font-mono text-slate-500 uppercase"
                    >
                      No matching budget items found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/15 bg-black/70 font-mono text-xs sm:text-sm">
                  <td colSpan={3} className="py-4 px-5 uppercase tracking-wider text-slate-300 font-bold">
                    Total Monthly Budget
                  </td>
                  <td className="py-4 px-5 text-right font-bold text-blue-400 text-base">
                    {formatINR(totals.allocated)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300">
          <FiInfo className="text-blue-400 shrink-0 mt-0.5" size={16} />
          <p className="leading-relaxed">
            This plan accounts for your full <strong className="text-white">₹24,665</strong> salary including the one-time <strong className="text-white">₹2,000</strong> PG security deposit for December. From January onward, that ₹2,000 can be shifted to savings, travel, or personal buffer.
          </p>
        </div>
      </div>
    </section>
  )
}