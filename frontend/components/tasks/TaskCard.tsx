'use client';

import { Calendar, CheckSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { CardFieldsVisibility, Task } from '../../lib/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      className="group relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-[var(--accent-color)]"
    >
      {/* Card Header: Title + Options */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm font-semibold text-[var(--foreground)] hover:accent-text line-clamp-2 leading-snug flex-1"
        >
          {task.title}
        </Link>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Dropdown
            trigger={
              <button className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800">
                <MoreHorizontal className="w-3.5 h-3.5" />
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

      {/* Description preview if exists */}
      {task.description && (
        <p className="text-xs text-[var(--muted-text)] line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due Date pill top-right if enabled */}
      {fields.dueDate && formattedDueDate && (
        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 mb-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDueDate}</span>
        </div>
      )}

      {/* Card Footer: Priority, Members, Labels */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-[var(--card-border)] text-xs">
        {/* Left side: Priority & Labels */}
        <div className="flex flex-wrap items-center gap-1.5">
          {fields.priority && (
            <Badge variant={task.priority}>
              {task.priority.toUpperCase()}
            </Badge>
          )}

          {fields.labels && task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((lbl) => (
                <span
                  key={lbl.id}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white shadow-2xs"
                  style={{ backgroundColor: lbl.color || '#3b82f6' }}
                >
                  {lbl.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Assignee / Members */}
        {fields.members && (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {task.members && task.members.length > 0 ? (
              task.members.map((member) => (
                <Avatar
                  key={member.id}
                  name={member.fullName}
                  src={member.avatarUrl}
                  size="sm"
                />
              ))
            ) : (
              <Avatar name="Unassigned" size="sm" />
            )}
          </div>
        )}
      </div>

      {/* Subtasks summary badge */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-[var(--muted-text)]">
          <CheckSquare className="w-3 h-3" />
          <span>
            {task.subtasks.filter((s) => s.priority === 'low').length}/{task.subtasks.length} subtasks
          </span>
        </div>
      )}
    </div>
  );
}
