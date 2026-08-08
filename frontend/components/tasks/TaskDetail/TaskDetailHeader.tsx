'use client';

import { Lock, MessageSquare, MoreHorizontal, Share2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface TaskDetailHeaderProps {
  commentCount?: number;
}

export function TaskDetailHeader({ commentCount = 0 }: TaskDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--card-border)]">
      {/* Left: sidebar toggle placeholder */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 text-[var(--muted-text)]">
        <button className="p-1.5 rounded hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors" title="Lock">
          <Lock className="w-4 h-4" />
        </button>

        <button className="flex items-center gap-1 p-1.5 rounded hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors text-xs">
          <MessageSquare className="w-4 h-4" />
          <span className="text-[var(--accent-color)] font-medium">{commentCount}</span>
        </button>

        <button className="p-1.5 rounded hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors" title="Share">
          <Share2 className="w-4 h-4" />
        </button>

        <button className="p-1.5 rounded hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors" title="More">
          <MoreHorizontal className="w-4 h-4" />
        </button>

        <button className="p-1.5 rounded hover:text-[var(--foreground)] hover:bg-[var(--column-bg)] transition-colors" title="Split view">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
        </button>
      </div>
    </div>
  );
}
