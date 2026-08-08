'use client';

import { Filter, X } from 'lucide-react';
import React from 'react';
import { TaskPriority, TaskStatus } from '../../lib/types';
import { Dropdown } from '../ui/Dropdown';

interface FilterPanelProps {
  statusFilter?: TaskStatus | 'all';
  priorityFilter?: TaskPriority | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  onPriorityFilterChange: (priority: TaskPriority | 'all') => void;
  onReset: () => void;
}

export function FilterPanel({
  statusFilter = 'all',
  priorityFilter = 'all',
  onStatusFilterChange,
  onPriorityFilterChange,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilter = statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <Dropdown
      trigger={
        <div
          className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
            hasActiveFilter
              ? 'accent-bg text-white border-transparent'
              : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
          {hasActiveFilter && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </div>
      }
    >
      <div className="p-3 space-y-3 w-56">
        <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            Filters
          </span>
          {hasActiveFilter && (
            <button
              onClick={onReset}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted-text)]">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'all')}
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--muted-text)]">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | 'all')}
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </Dropdown>
  );
}
