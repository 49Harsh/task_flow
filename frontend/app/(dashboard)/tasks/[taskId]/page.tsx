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
  const params   = useParams();
  const router   = useRouter();
  const taskId   = params.taskId as string;

  const [task, setTask]           = useState<Task | null>(null);
  const [comments, setComments]   = useState<Comment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');

  const loadTask = async () => {
    try {
      const data = await api.getTaskDetail(taskId);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || '');
      const cmts = await api.getComments(taskId).catch(() => []);
      setComments(cmts.length ? cmts : (data.comments || []));
    } catch (e) {
      console.error('Failed to load task:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (taskId) loadTask(); }, [taskId]);

  const handleUpdateStatus   = async (status: TaskStatus)   => { if (!task) return; const u = await api.updateTask(task.id, { status });   setTask(u); const c = await api.getComments(taskId).catch(() => []); if (c.length) setComments(c); };
  const handleUpdatePriority = async (priority: TaskPriority) => { if (!task) return; const u = await api.updateTask(task.id, { priority }); setTask(u); const c = await api.getComments(taskId).catch(() => []); if (c.length) setComments(c); };
  const handleUpdateDueDate  = async (dueDate: string)       => { if (!task) return; const u = await api.updateTask(task.id, { dueDate });   setTask(u); };

  const handleTitleBlur = async () => {
    if (!task || title.trim() === task.title) return;
    const u = await api.updateTask(task.id, { title: title.trim() });
    setTask(u);
  };

  const handleDescriptionBlur = async () => {
    if (!task || description.trim() === (task.description || '')) return;
    const u = await api.updateTask(task.id, { description: description.trim() });
    setTask(u);
  };

  const handleAddSubtask = async (t: string, p?: TaskPriority) => {
    if (!task) return;
    await api.createSubtask(task.id, t, p);
    await loadTask();
  };

  const handleDeleteSubtask = async (id: string) => {
    await api.deleteSubtask(id);
    await loadTask();
  };

  const handleSendComment = async (content: string) => {
    if (!task) return;
    const c = await api.addComment(task.id, content);
    setComments((prev) => [...prev, c]);
  };

  const handleAddResourceLink = async (link: string) => {
    if (!task) return;
    const u = await api.updateTask(task.id, { resourceLinks: [...(task.resourceLinks || []), link] });
    setTask(u);
  };

  if (loading) {
    return <div className="py-20 flex justify-center text-xs text-[var(--muted-text)]">Loading task details...</div>;
  }

  if (!task) {
    return (
      <div className="py-20 text-center space-y-2">
        <p className="text-sm font-semibold text-rose-500">Task not found</p>
        <button onClick={() => router.push('/tasks')} className="text-xs accent-text hover:underline">
          Back to tasks
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden">
      {/* Top action bar */}
      <TaskDetailHeader commentCount={comments.length} />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">
        {/* ── Main content ───────────────────────────────────────────── */}
        <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-2xl font-bold text-[var(--foreground)] bg-transparent border-none focus:outline-none leading-tight"
            placeholder="Task title..."
          />

          {/* Description */}
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              if (val !== description) {
                setDescription(val);
                if (task) api.updateTask(task.id, { description: val });
              }
            }}
            className="text-sm text-[var(--muted-text)] leading-relaxed focus:outline-none empty:before:content-['Add_a_description...'] empty:before:text-[var(--muted-text)]"
          >
            {description}
          </p>

          {/* Properties / Labels / Resources */}
          <TaskProperties
            assignees={task.members}
            dueDate={task.dueDate}
            labels={task.labels}
            resourceLinks={task.resourceLinks}
            onAddResourceLink={handleAddResourceLink}
          />

          {/* Subtasks */}
          <SubtaskTable
            subtasks={task.subtasks}
            onAddSubtask={handleAddSubtask}
            onDeleteSubtask={handleDeleteSubtask}
          />

          {/* Inline reply composer (shown above activity like screenshot) */}
          <CommentComposer onSendComment={handleSendComment} placeholder="Leave a reply..." />

          {/* Activity / Updates feed */}
          <ActivityFeed comments={comments} />

          {/* Bottom "Add a comment" composer */}
          <CommentComposer onSendComment={handleSendComment} placeholder="Add a comment..." />
        </div>

        {/* ── Right sidebar ───────────────────────────────────────────── */}
        <DetailsSidebar
          status={task.status}
          priority={task.priority}
          dueDate={task.dueDate}
          reporter={task.reporter}
          members={task.members}
          labels={task.labels}
          teams={task.teams}
          onStatusChange={handleUpdateStatus}
          onPriorityChange={handleUpdatePriority}
          onDueDateChange={handleUpdateDueDate}
        />
      </div>
    </div>
  );
}
