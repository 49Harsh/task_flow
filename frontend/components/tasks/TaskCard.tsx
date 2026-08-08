'use client';

import { Calendar, MoreHorizontal, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { CardFieldsVisibility, Task } from '../../lib/types';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';

interface TaskCardProps {
  task: Task;
  fields: CardFieldsVisibility;
  onDelete?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, fields, onDelete, onDragStart }: TaskCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formattedDueDate = formatDate(task.dueDate);
  const primaryMember = task.members?.[0];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      className="group relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing"
    >
      {/* Card Header: Title + Options */}
      <div className="flex items-start justify-between gap-1.5 mb-2.5">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm font-medium text-[var(--foreground)] hover:accent-text line-clamp-2 leading-snug flex-1"
        >
          {task.title}
        </Link>

        <div className="shrink-0">
          <Dropdown
            trigger={
              <button className="p-0.5 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>
      </div>

      {/* Member row + Due Date */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        {/* Member */}
        {fields.members && primaryMember && (
          <div className="flex items-center gap-1.5">
            <Avatar name={primaryMember.fullName} src={primaryMember.avatarUrl} size="sm" />
            <span className="text-xs text-[var(--muted-text)] truncate max-w-[90px]">
              {primaryMember.fullName.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Due Date — red badge matching screenshot */}
        {fields.dueDate && formattedDueDate && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formattedDueDate}</span>
          </div>
        )}
      </div>

      {/* Labels — tag icon prefix matching screenshot */}
      {fields.labels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.labels.map((lbl, idx) => (
            <span
              key={`${lbl.id}-${idx}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--column-bg)] text-[var(--foreground)]"
            >
              <Tag className="w-2.5 h-2.5 shrink-0" style={{ color: lbl.color }} />
              {lbl.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
