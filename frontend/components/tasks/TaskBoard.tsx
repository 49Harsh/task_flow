'use client';

import React from 'react';
import { CardFieldsVisibility, Task, TaskStatus } from '../../lib/types';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  fields: CardFieldsVisibility;
  onAddTask: (status: TaskStatus, title?: string) => void;
  onDeleteTask: (id: string) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'doing', title: 'Doing' },
  { status: 'completed', title: 'Completed' },
  { status: 'on_hold', title: 'On Hold' },
];

export function TaskBoard({
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
  onDropTask,
}: TaskBoardProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-6 h-[calc(100vh-13rem)] items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return (
          <TaskColumn
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={columnTasks}
            fields={fields}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
            onDropTask={onDropTask}
          />
        );
      })}
    </div>
  );
}
