'use client';

import { Calendar, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Subtask, TaskPriority } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';

interface SubtaskTableProps {
  subtasks?: Subtask[];
  onAddSubtask?: (title: string, priority?: TaskPriority) => Promise<void>;
  onDeleteSubtask?: (id: string) => Promise<void>;
}

export function SubtaskTable({
  subtasks = [],
  onAddSubtask,
  onDeleteSubtask,
}: SubtaskTableProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
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
    <div className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
          Subtasks ({subtasks.length})
        </h4>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-1 text-xs font-semibold accent-text hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subtask</span>
        </button>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--card-border)] bg-[var(--background)] text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text)]">
              <th className="py-2.5 px-4">Task</th>
              <th className="py-2.5 px-4 w-28">Priority</th>
              <th className="py-2.5 px-4 w-24">Members</th>
              <th className="py-2.5 px-4 w-28">Due Date</th>
              <th className="py-2.5 px-4 w-12 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subtasks.map((subtask) => (
              <tr
                key={subtask.id}
                className="border-b border-[var(--card-border)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-2.5 px-4 text-xs font-medium text-[var(--foreground)]">
                  {subtask.title}
                </td>
                <td className="py-2.5 px-4">
                  <Badge variant={subtask.priority}>{subtask.priority.toUpperCase()}</Badge>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center -space-x-1">
                    {subtask.members && subtask.members.length > 0 ? (
                      subtask.members.map((m) => (
                        <Avatar key={m.id} name={m.fullName} src={m.avatarUrl} size="sm" />
                      ))
                    ) : (
                      <span className="text-[10px] text-[var(--muted-text)]">—</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4 text-xs text-[var(--muted-text)]">
                  {subtask.dueDate ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(subtask.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <button
                    onClick={() => onDeleteSubtask?.(subtask.id)}
                    className="p-1 text-[var(--muted-text)] hover:text-rose-500 transition-colors"
                    title="Delete subtask"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {subtasks.length === 0 && !isAdding && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-xs text-[var(--muted-text)] italic">
                  No subtasks added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add Subtask Form Row */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-3 border-t border-[var(--card-border)] flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter subtask title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-color)]"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
              className="px-2 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs font-medium accent-bg text-white rounded-md hover:opacity-90"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
