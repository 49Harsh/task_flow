'use client';

import { ChevronDown, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { CardFieldsVisibility, Task, TaskStatus } from '../../lib/types';
import { TaskListRow } from './TaskListRow';

interface TaskListGroupProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  fields: CardFieldsVisibility;
  onAddTask: (status: TaskStatus, title?: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskListGroup({
  status,
  title,
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
}: TaskListGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask(status, quickTitle.trim());
    setQuickTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden shadow-2xs mb-4">
      {/* Collapsible Group Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-4 py-3 bg-[var(--background)] cursor-pointer select-none border-b border-[var(--card-border)]"
      >
        <div className="flex items-center space-x-2">
          <ChevronDown
            className={`w-4 h-4 text-[var(--muted-text)] transition-transform duration-200 ${
              isOpen ? '' : '-rotate-90'
            }`}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--card-bg)] text-[var(--muted-text)] border border-[var(--card-border)]">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAdding(true);
            setIsOpen(true);
          }}
          className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]"
          title="Add Task"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Group Table */}
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)] text-[10px] uppercase tracking-wider font-semibold text-[var(--muted-text)]">
                <th className="py-2.5 px-4">Task</th>
                {fields.priority && <th className="py-2.5 px-4 w-28">Priority</th>}
                {fields.members && <th className="py-2.5 px-4 w-28">Members</th>}
                {fields.dueDate && <th className="py-2.5 px-4 w-32">Due Date</th>}
                <th className="py-2.5 px-4 w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskListRow
                  key={task.id}
                  task={task}
                  fields={fields}
                  onDelete={onDeleteTask}
                />
              ))}

              {tasks.length === 0 && !isAdding && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-xs text-[var(--muted-text)] italic"
                  >
                    No tasks in {title}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Quick Add Row */}
          {isAdding ? (
            <form onSubmit={handleQuickAdd} className="p-3 border-t border-[var(--card-border)] flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter task title..."
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-color)]"
              />
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium accent-bg text-white rounded-md hover:opacity-90"
              >
                Add Task
              </button>
            </form>
          ) : (
            <div
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-1.5 border-t border-[var(--card-border)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
