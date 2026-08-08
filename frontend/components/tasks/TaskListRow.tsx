'use client';

import { Calendar, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { CardFieldsVisibility, Task } from '../../lib/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../ui/Dropdown';

interface TaskListRowProps {
  task: Task;
  fields: CardFieldsVisibility;
  onDelete?: (id: string) => void;
}

export function TaskListRow({ task, fields, onDelete }: TaskListRowProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <tr className="border-b border-[var(--card-border)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      {/* Task Title Column */}
      <td className="py-3 px-4">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm font-medium text-[var(--foreground)] hover:accent-text transition-colors block"
        >
          {task.title}
        </Link>
        {task.labels && task.labels.length > 0 && fields.labels && (
          <div className="flex gap-1 mt-1">
            {task.labels.map((l) => (
              <span
                key={l.id}
                className="px-1.5 py-0.2 text-[10px] rounded text-white"
                style={{ backgroundColor: l.color }}
              >
                {l.name}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Priority Column */}
      {fields.priority && (
        <td className="py-3 px-4">
          <Badge variant={task.priority}>{task.priority.toUpperCase()}</Badge>
        </td>
      )}

      {/* Members Column */}
      {fields.members && (
        <td className="py-3 px-4">
          <div className="flex items-center -space-x-1.5">
            {task.members && task.members.length > 0 ? (
              task.members.map((m) => (
                <Avatar key={m.id} name={m.fullName} src={m.avatarUrl} size="sm" />
              ))
            ) : (
              <div className="w-6 h-6 rounded-full border border-dashed border-[var(--card-border)] flex items-center justify-center text-[var(--muted-text)] text-xs">
                <Plus className="w-3 h-3" />
              </div>
            )}
          </div>
        </td>
      )}

      {/* Due Date Column */}
      {fields.dueDate && (
        <td className="py-3 px-4 text-xs text-[var(--muted-text)]">
          {task.dueDate ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          ) : (
            '—'
          )}
        </td>
      )}

      {/* Actions Column */}
      <td className="py-3 px-4 text-right">
        <Dropdown
          trigger={
            <button className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-700">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            {
              label: 'Delete Task',
              onClick: () => onDelete?.(task.id),
              icon: <Trash2 className="w-4 h-4" />,
              danger: true,
            },
          ]}
        />
      </td>
    </tr>
  );
}
