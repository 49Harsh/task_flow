'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TaskPriority, TaskStatus } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

interface AddTaskModalProps {
  isOpen: boolean;
  initialStatus?: TaskStatus;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    projectId: string;
  }) => Promise<void>;
}

export function AddTaskModal({
  isOpen,
  initialStatus = 'todo',
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const { projects } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);

  const defaultProjectId = projects[0]?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        projectId: projectId || defaultProjectId,
      });
      // reset form
      setTitle('');
      setDescription('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title *"
          placeholder="e.g., Implement authentication flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Add detailed task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {projects.length > 0 && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                Project
              </label>
              <select
                value={projectId || defaultProjectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[var(--card-border)]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
