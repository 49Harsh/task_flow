'use client';

import React from 'react';
import { CardFieldsVisibility, Task, TaskStatus } from '../../lib/types';
import { TaskListGroup } from './TaskListGroup';

interface TaskListViewProps {
  tasks: Task[];
  fields: CardFieldsVisibility;
  onAddTask: (status: TaskStatus, title?: string) => void;
  onDeleteTask: (id: string) => void;
}

const GROUPS: { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'doing', title: 'Doing' },
  { status: 'completed', title: 'Completed' },
  { status: 'on_hold', title: 'On Hold' },
];

export function TaskListView({
  tasks,
  fields,
  onAddTask,
  onDeleteTask,
}: TaskListViewProps) {
  return (
    <div className="space-y-4 max-w-6xl pb-8">
      {GROUPS.map((group) => {
        const groupTasks = tasks.filter((t) => t.status === group.status);
        return (
          <TaskListGroup
            key={group.status}
            status={group.status}
            title={group.title}
            tasks={groupTasks}
            fields={fields}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        );
      })}
    </div>
  );
}
