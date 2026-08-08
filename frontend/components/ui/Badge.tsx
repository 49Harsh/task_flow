'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'todo' | 'doing' | 'completed' | 'on_hold' | 'low' | 'medium' | 'high' | 'urgent' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    doing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    on_hold: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-semibold',
    accent: 'accent-bg text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
