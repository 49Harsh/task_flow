'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ActivityFeed } from '../../../../components/tasks/TaskDetail/ActivityFeed';
import { CommentComposer } from '../../../../components/tasks/TaskDetail/CommentComposer';
import { DetailsSidebar } from '../../../../components/tasks/TaskDetail/DetailsSidebar';
import { SubtaskTable } from '../../../../components/tasks/TaskDetail/SubtaskTable';
import { TaskDetailHeader } from '../../../../components/tasks/TaskDetail/TaskDetailHeader';
import { TaskProperties } from '../../../../components/tasks/TaskDetail/TaskProperties';
import { api } from '../../../../lib/api';
import { Comment, Task, TaskPriority, TaskStatus } from '../../../../lib/types';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadTask = async () => {
    try {
      const data = await api.getTaskDetail(taskId);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || '');
      const cmts = await api.getComments(taskId).catch(() => []);
      setComments(cmts);
    } catch (e) {
      console.error('Failed to load task:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) loadTask();
  }, [taskId]);

  const handleUpdateStatus = async (status: TaskStatus) => {
    if (!task) return;
    const updated = await api.updateTask(task.id, { status });
    setTask(updated);
    const cmts = await api.getComments(taskId);
    setComments(cmts);
  };

  const handleUpdatePriority = async (priority: TaskPriority) => {
    if (!task) return;
    const updated = await api.updateTask(task.id, { priority });
    setTask(updated);
    const cmts = await api.getComments(taskId);
    setComments(cmts);
  };

  const handleUpdateDueDate = async (dueDate: string) => {
    if (!task) return;
    const updated = await api.updateTask(task.id, { dueDate });
    setTask(updated);
  };

  const handleTitleBlur = async () => {
    if (!task || title.trim() === task.title) return;
    const updated = await api.updateTask(task.id, { title: title.trim() });
    setTask(updated);
  };

  const handleDescriptionBlur = async () => {
    if (!task || description.trim() === (task.description || '')) return;
    const updated = await api.updateTask(task.id, { description: description.trim() });
    setTask(updated);
  };

  const handleAddSubtask = async (subtaskTitle: string, priority?: TaskPriority) => {
    if (!task) return;
    await api.createSubtask(task.id, subtaskTitle, priority);
    await loadTask();
  };

  const handleDeleteSubtask = async (id: string) => {
    await api.deleteSubtask(id);
    await loadTask();
  };

  const handleSendComment = async (content: string) => {
    if (!task) return;
    const newComment = await api.addComment(task.id, content);
    setComments((prev) => [...prev, newComment]);
  };

  const handleAddResourceLink = async (link: string) => {
    if (!task) return;
    const existing = task.resourceLinks || [];
    const updated = await api.updateTask(task.id, {
      resourceLinks: [...existing, link],
    });
    setTask(updated);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center text-xs text-[var(--muted-text)]">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm font-semibold text-rose-500">Task not found</p>
        <button
          onClick={() => router.push('/tasks')}
          className="text-xs accent-text hover:underline"
        >
          Return to tasks
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden shadow-lg">
      <TaskDetailHeader commentCount={comments.length} onBack={() => router.push('/tasks')} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-12rem)]">
        {/* Main Left Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Inline Editable Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-2xl font-extrabold text-[var(--foreground)] bg-transparent border-b border-transparent hover:border-[var(--card-border)] focus:border-[var(--accent-color)] focus:outline-none transition-colors"
            placeholder="Task Title..."
          />

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add a detailed description..."
              className="w-full text-sm bg-[var(--background)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)] resize-none"
            />
          </div>

          {/* Properties Row */}
          <TaskProperties
            assignees={task.members}
            labels={task.labels}
            resourceLinks={task.resourceLinks}
            onAddResourceLink={handleAddResourceLink}
          />

          {/* Subtasks Section */}
          <SubtaskTable
            subtasks={task.subtasks}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
          />

          {/* Activity Feed & Comment Composer */}
          <ActivityFeed comments={comments} />
          <CommentComposer onSendComment={handleSendComment} />
        </div>

        {/* Right Details Sidebar */}
        <DetailsSidebar
          status={task.status}
          priority={task.priority}
          dueDate={task.dueDate}
          reporter={task.reporter}
          members={task.members}
          teams={task.teams}
          onStatusChange={handleUpdateStatus}
          onPriorityChange={handleUpdatePriority}
          onDueDateChange={handleUpdateDueDate}
        />
      </div>
    </div>
  );
}
