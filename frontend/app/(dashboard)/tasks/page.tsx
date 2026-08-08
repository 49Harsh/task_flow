'use client';

import { Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AddTaskModal } from '../../../components/tasks/AddTaskModal';
import { FieldsDropdown } from '../../../components/tasks/FieldsDropdown';
import { FilterPanel } from '../../../components/tasks/FilterPanel';
import { TaskBoard } from '../../../components/tasks/TaskBoard';
import { TaskListView } from '../../../components/tasks/TaskListView';
import { ViewToggle } from '../../../components/tasks/ViewToggle';
import { Avatar } from '../../../components/ui/Avatar';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { CardFieldsVisibility, Task, TaskPriority, TaskStatus } from '../../../lib/types';

export default function TasksPage() {
  const { projects, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  const [fields, setFields] = useState<CardFieldsVisibility>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus>('todo');

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = (status: TaskStatus, title?: string) => {
    if (title) {
      api
        .createTask({
          title,
          status,
          priority: 'medium',
          projectId: projects[0]?.id || '',
        })
        .then(() => loadTasks());
    } else {
      setModalInitialStatus(status);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await api.deleteTask(id);
    await loadTasks();
  };

  const handleDropTask = async (taskId: string, targetStatus: TaskStatus) => {
    const targetTasks = tasks.filter((t) => t.status === targetStatus);
    const newPosition = targetTasks.length;
    await api.updateTaskPosition(taskId, targetStatus, newPosition);
    await loadTasks();
  };

  const handleModalSubmit = async (taskData: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    projectId: string;
  }) => {
    await api.createTask(taskData);
    await loadTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page Toolbar — matches screenshot */}
      <div className="flex items-center justify-between gap-4 mb-5">
        {/* Left: Title + member avatars */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Tasks</h1>
          {/* Member avatars shown next to title like in screenshot */}
          {user && (
            <div className="flex items-center -space-x-1.5">
              <Avatar name={user.fullName} src={user.avatarUrl} size="sm" className="ring-2 ring-[var(--card-bg)]" />
            </div>
          )}
        </div>

        {/* Right: Search, Fields, Filter, Add Task */}
        <div className="flex items-center gap-2">
          {/* Inline search (expands on click) */}
          {searchOpen ? (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                className="pl-8 pr-3 py-1.5 text-xs w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Fields visibility toggle */}
          <FieldsDropdown fields={fields} onChange={setFields} />

          {/* Filter panel */}
          <FilterPanel
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onReset={() => { setStatusFilter('all'); setPriorityFilter('all'); }}
          />

          <ViewToggle view={view} onViewChange={setView} />

          {/* Add Task — black button matching screenshot */}
          <button
            onClick={() => handleAddTask('todo')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#18181b] hover:bg-black text-white rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {loading ? (
        <div className="py-20 flex justify-center text-xs text-[var(--muted-text)]">
          Loading tasks...
        </div>
      ) : view === 'board' ? (
        <TaskBoard
          tasks={filteredTasks}
          fields={fields}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onDropTask={handleDropTask}
        />
      ) : (
        <TaskListView
          tasks={filteredTasks}
          fields={fields}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        initialStatus={modalInitialStatus}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
