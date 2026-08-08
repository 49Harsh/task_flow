'use client';

import { ArrowLeft, Bell, MessageSquare, MoreHorizontal, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface TaskDetailHeaderProps {
  commentCount?: number;
  onBack?: () => void;
}

export function TaskDetailHeader({ commentCount = 0, onBack }: TaskDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="flex items-center space-x-3">
        <Link
          href="/tasks"
          className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Back to Tasks"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
          Task Details
        </span>
      </div>

      <div className="flex items-center space-x-2 text-[var(--muted-text)]">
        <button
          className="p-1.5 rounded-md hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Watch task"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1 p-1.5 rounded-md text-xs">
          <MessageSquare className="w-4 h-4" />
          <span>{commentCount}</span>
        </div>

        <button
          className="p-1.5 rounded-md hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          className="p-1.5 rounded-md hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
