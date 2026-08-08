'use client';

import { Calendar, Plus, Settings, Tag, User, Users } from 'lucide-react';
import React from 'react';
import { TaskPriority, TaskStatus, User as UserType } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

interface DetailsSidebarProps {
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reporter?: UserType;
  members?: UserType[];
  teams?: string[];
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onDueDateChange: (date: string) => void;
}

export function DetailsSidebar({
  status,
  priority,
  dueDate,
  reporter,
  members = [],
  teams = [],
  onStatusChange,
  onPriorityChange,
  onDueDateChange,
}: DetailsSidebarProps) {
  return (
    <div className="w-full lg:w-72 bg-[var(--card-bg)] border-l border-[var(--card-border)] p-4 space-y-6">
      {/* Panel Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
          Details
        </h4>
        <div className="flex items-center space-x-1 text-[var(--muted-text)]">
          <button className="p-1 rounded hover:text-[var(--foreground)]" title="Add Field">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 rounded hover:text-[var(--foreground)]" title="Configure Fields">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Field Items */}
      <div className="space-y-4 text-xs">
        {/* Status Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="w-full px-3 py-1.5 bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--accent-color)]"
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="backlog">Backlog</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
            className="w-full px-3 py-1.5 bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--accent-color)]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Due Date
          </label>
          <input
            type="date"
            value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] font-medium"
          />
        </div>

        {/* Reporter */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3" /> Reporter
          </label>
          <div className="flex items-center space-x-2 pt-1">
            <Avatar name={reporter?.fullName || 'Reporter'} src={reporter?.avatarUrl} size="sm" />
            <span className="font-medium text-[var(--foreground)]">{reporter?.fullName || 'System'}</span>
          </div>
        </div>

        {/* Members */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3 h-3" /> Members
          </label>
          <div className="flex items-center -space-x-1.5 pt-1">
            {members.length > 0 ? (
              members.map((m) => <Avatar key={m.id} name={m.fullName} src={m.avatarUrl} size="sm" />)
            ) : (
              <span className="text-[var(--muted-text)] italic">No members assigned</span>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
            Teams
          </label>
          <div className="flex flex-wrap gap-1 pt-1">
            {teams.length > 0 ? (
              teams.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-[var(--foreground)] border border-[var(--card-border)]"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-[var(--muted-text)] italic">Frontend Engineering</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
