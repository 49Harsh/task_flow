'use client';

import { Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AddTaskModal } from '../../../components/tasks/AddTaskModal';
import { FieldsDropdown } from '../../../components/tasks/FieldsDropdown';
import { FilterPanel } from '../../../components/tasks/FilterPanel';
import { TaskBoard } from '../../../components/tasks/TaskBoard';
import { TaskListView } from '../../../components/tasks/TaskListView';
import { ViewToggle } from '../../../components/tasks/ViewToggle';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { CardFieldsVisibility, Task, TaskPriority, TaskStatus } from '../../../lib/types';

export default function TasksPage() {
  const { projects } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
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
      // Quick add
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

  // Filter tasks locally by search & dropdown filters
  const filteredTasks = tasks.filter((task) => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Tasks</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Manage, organize, and prioritize workspace tasks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>

          <FieldsDropdown fields={fields} onChange={setFields} />

          <FilterPanel
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onStatusFilterChange={setStatusFilter}
            onPriorityFilterChange={setPriorityFilter}
            onReset={() => {
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          />

          <ViewToggle view={view} onViewChange={setView} />

          <Button onClick={() => handleAddTask('todo')} size="sm">
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Main Task View */}
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
