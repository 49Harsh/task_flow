'use client';

import { GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { CardFieldsVisibility, Task, TaskStatus } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  fields: CardFieldsVisibility;
  onAddTask: (status: TaskStatus, title?: string) => void;
  onDeleteTask: (id: string) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
}

export function TaskColumn({
  status,
  title,
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
  onDropTask,
}: TaskColumnProps) {
  const [quickTitle, setQuickTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask(status, quickTitle.trim());
    setQuickTitle('');
    setIsAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column itself
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onDropTask(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-72 shrink-0 rounded-xl transition-colors ${
        isDragOver
          ? 'bg-[var(--card-border)]'
          : 'bg-[var(--column-bg)]'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[var(--muted-text)] cursor-grab shrink-0" />
          <span className="text-xs font-semibold text-[var(--foreground)]">{title}</span>
          <span className="text-xs text-[var(--muted-text)] font-medium">{tasks.length}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
            title="Add Task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
            title="Column Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-2 space-y-2 min-h-[80px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            fields={fields}
            onDelete={onDeleteTask}
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form onSubmit={handleQuickAdd} className="px-2 pt-2">
          <input
            type="text"
            placeholder="Task title..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
            className="w-full px-2.5 py-1.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)] mb-1.5"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => { setIsAdding(false); setQuickTitle(''); }}
              className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] py-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-medium accent-bg text-white rounded-md hover:opacity-90"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Add Task Footer */}
      <button
        onClick={() => onAddTask(status)}
        className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors w-full"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Task</span>
      </button>
    </div>
  );
}
