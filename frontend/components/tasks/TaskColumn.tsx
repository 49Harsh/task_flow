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

  const handleDragLeave = () => {
    setIsDragOver(false);
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
      className={`flex flex-col w-80 shrink-0 bg-[var(--background)] border border-[var(--card-border)] rounded-xl p-3 max-h-full transition-colors ${
        isDragOver ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--card-border)]">
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-[var(--muted-text)] cursor-grab" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--card-bg)] text-[var(--muted-text)] border border-[var(--card-border)]">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-colors"
            title="Quick Add Task"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] transition-colors"
            title="Column Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            fields={fields}
            onDelete={onDeleteTask}
            onDragStart={handleDragStart}
          />
        ))}

        {tasks.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-[var(--card-border)] rounded-lg text-[var(--muted-text)] text-xs">
            No tasks in {title}
          </div>
        )}
      </div>

      {/* Quick Add Form or Bottom Add Task Row */}
      {isAdding ? (
        <form onSubmit={handleQuickAdd} className="mt-3 pt-2 border-t border-[var(--card-border)]">
          <input
            type="text"
            placeholder="Enter task title..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            autoFocus
            className="w-full px-3 py-1.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-color)] mb-2"
          />
          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-medium accent-bg text-white rounded-md hover:opacity-90"
            >
              Add
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => onAddTask(status)}
          className="w-full mt-3 flex items-center justify-center space-x-1.5 py-2 text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] border border-dashed border-[var(--card-border)] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}
