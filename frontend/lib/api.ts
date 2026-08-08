import { Comment, Label, Project, Subtask, Task, TaskPriority, TaskStatus, User, Workspace } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('taskflow_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData?.error?.message || errorData?.message || `HTTP error ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  // Auth
  guestLogin: async (fullName?: string) => {
    const data = await request<{ accessToken: string; user: User }>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ fullName: fullName || 'Guest User' }),
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskflow_token', data.accessToken);
    }
    return data;
  },

  // Users
  getMe: () => request<User>('/users/me'),
  updateProfile: (data: { fullName?: string; title?: string; username?: string; avatarUrl?: string }) =>
    request<User>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateSettings: (data: { theme?: 'light' | 'dark'; accentColor?: string }) =>
    request<User>('/users/me/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Workspaces & Projects
  getWorkspace: () => request<Workspace>('/workspace'),
  getProjects: () => request<Project[]>('/projects'),
  createProject: (name: string) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  // Labels
  getLabels: () => request<Label[]>('/labels'),
  createLabel: (name: string, color: string) =>
    request<Label[]>('/labels', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    }),

  // Tasks
  getTasks: (projectId?: string, status?: TaskStatus) => {
    const query = new URLSearchParams();
    if (projectId) query.append('projectId', projectId);
    if (status) query.append('status', status);
    const queryString = query.toString();
    return request<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },
  getTaskDetail: (id: string) => request<Task>(`/tasks/${id}`),
  createTask: (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    projectId: string;
    memberIds?: string[];
    labelIds?: string[];
    resourceLinks?: string[];
    teams?: string[];
  }) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string;
      projectId?: string;
      memberIds?: string[];
      labelIds?: string[];
      resourceLinks?: string[];
      teams?: string[];
    },
  ) =>
    request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateTaskPosition: (id: string, status: TaskStatus, position: number) =>
    request<Task>(`/tasks/${id}/position`, {
      method: 'PATCH',
      body: JSON.stringify({ status, position }),
    }),
  deleteTask: (id: string) =>
    request<{ deleted: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Subtasks
  createSubtask: (taskId: string, title: string, priority?: TaskPriority, dueDate?: string) =>
    request<Subtask>(`/tasks/${taskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title, priority, dueDate }),
    }),
  updateSubtask: (id: string, data: { title?: string; priority?: TaskPriority; dueDate?: string }) =>
    request<Subtask>(`/subtasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteSubtask: (id: string) =>
    request<{ deleted: boolean }>(`/subtasks/${id}`, {
      method: 'DELETE',
    }),

  // Comments
  getComments: (taskId: string) => request<Comment[]>(`/tasks/${taskId}/comments`),
  addComment: (taskId: string, content: string) =>
    request<Comment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};
