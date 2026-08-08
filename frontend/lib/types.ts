export type Theme = 'light' | 'dark';

export type TaskStatus = 'todo' | 'doing' | 'completed' | 'on_hold' | 'backlog';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type CommentType = 'comment' | 'system_update';

export interface User {
  id: string;
  email: string;
  fullName: string;
  title?: string;
  username?: string;
  avatarUrl?: string;
  isGuest: boolean;
  theme: Theme;
  accentColor: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  avatarUrl?: string;
  ownerId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  workspaceId: string;
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string;
  position: number;
  members?: User[];
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  author?: User;
  content: string;
  type: CommentType;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  position: number;
  projectId: string;
  project?: Project;
  reporterId: string;
  reporter?: User;
  members?: User[];
  labels?: Label[];
  resourceLinks?: string[];
  teams?: string[];
  subtasks?: Subtask[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CardFieldsVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}
