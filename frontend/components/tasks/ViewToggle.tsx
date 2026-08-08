'use client';

import { Kanban, List } from 'lucide-react';
import React from 'react';

interface ViewToggleProps {
  view: 'board' | 'list';
  onViewChange: (view: 'board' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center p-0.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          view === 'list'
            ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-2xs font-semibold'
            : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
        }`}
      >
        <List className="w-3.5 h-3.5" />
        <span>List</span>
      </button>

      <button
        onClick={() => onViewChange('board')}
        className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          view === 'board'
            ? 'bg-[var(--card-bg)] text-[var(--foreground)] shadow-2xs font-semibold'
            : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'
        }`}
      >
        <Kanban className="w-3.5 h-3.5" />
        <span>Board</span>
      </button>
    </div>
  );
}
