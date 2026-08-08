'use client';

import { Calendar, ChevronDown, ChevronRight, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Subtask, TaskPriority } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

const PRIORITY_ICON: Record<TaskPriority, { icon: string; color: string }> = {
  urgent: { icon: '▲', color: '#ef4444' },
  high:   { icon: '▲', color: '#f97316' },
  medium: { icon: '▲', color: '#f59e0b' },
  low:    { icon: '·', color: '#94a3b8' },
};

interface SubtaskTableProps {
  subtasks?: Subtask[];
  onAddSubtask?: (title: string, priority?: TaskPriority) => Promise<void>;
  onDeleteSubtask?: (id: string) => Promise<void>;
}

export function SubtaskTable({ subtasks = [], onAddSubtask, onDeleteSubtask }: SubtaskTableProps) {
  const [open, setOpen] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !onAddSubtask) return;
    setLoading(true);
    try {
      await onAddSubtask(newTitle.trim(), newPriority);
      setNewTitle('');
      setIsAdding(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Section header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--foreground)] mb-2"
      >
        {open ? <ChevronDown className="w-4 h-4 text-[var(--muted-text)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted-text)]" />}
        Subtasks
      </button>

      {open && (
        <>
          {/* Table */}
          <div className="border border-[var(--card-border)] rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--card-border)] bg-[var(--column-bg)]">
                  <th className="py-2 px-4 font-medium text-[var(--muted-text)]">Task</th>
                  <th className="py-2 px-4 font-medium text-[var(--muted-text)] w-28">Priority</th>
                  <th className="py-2 px-4 font-medium text-[var(--muted-text)] w-24">Members</th>
                  <th className="py-2 px-4 font-medium text-[var(--muted-text)] w-32">Due Date</th>
                  <th className="py-2 px-4 font-medium text-[var(--muted-text)] w-16 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subtasks.map((s) => {
                  const p = PRIORITY_ICON[s.priority];
                  const dateStr = s.dueDate
                    ? new Date(s.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—';
                  return (
                    <tr key={s.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--hover-bg)] transition-colors">
                      <td className="py-2.5 px-4 font-medium text-[var(--foreground)]">{s.title}</td>
                      <td className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1" style={{ color: p.color }}>
                          <span className="text-[10px]">{p.icon}</span>
                          <span className="capitalize font-medium">{s.priority}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {s.members && s.members.length > 0 ? (
                          <div className="flex items-center -space-x-1">
                            {s.members.map((m) => (
                              <Avatar key={m.id} name={m.fullName} src={m.avatarUrl} size="sm" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[var(--muted-text)]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[var(--muted-text)]">{dateStr}</td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          className="p-1 text-[var(--muted-text)] hover:text-[var(--foreground)]"
                          onClick={() => onDeleteSubtask?.(s.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {subtasks.length === 0 && !isAdding && (
                  <tr>
                    <td colSpan={5} className="py-5 text-center text-xs text-[var(--muted-text)]">
                      No subtasks yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add subtask form */}
          {isAdding && (
            <form onSubmit={handleAdd} className="flex items-center gap-2 mt-2">
              <input
                autoFocus
                type="text"
                placeholder="Subtask title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-color)]"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="px-2 py-1.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-[var(--muted-text)]">Cancel</button>
              <button type="submit" disabled={loading} className="px-3 py-1.5 text-xs font-medium accent-bg text-white rounded-md hover:opacity-90">
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
          )}

          {/* + Add Subtasks */}
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 mt-2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Subtasks
          </button>
        </>
      )}
    </div>
  );
}
