import { Comment, Label, Project, Subtask, Task, TaskPriority, TaskStatus, User, Workspace } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('taskflow_token');
}

// LocalStorage Mock Store for offline / backend-unreachable fallback
const MOCK_STORAGE_KEYS = {
  USER: 'taskflow_mock_user',
  TASKS: 'taskflow_mock_tasks',
  PROJECTS: 'taskflow_mock_projects',
  LABELS: 'taskflow_mock_labels',
  COMMENTS: 'taskflow_mock_comments',
};

function getMockStorage<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setMockStorage<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to set mock storage', e);
  }
}

const INITIAL_MOCK_USER: User = {
  id: 'mock-user-1',
  email: 'guest@taskflow.dev',
  fullName: 'Dexter Guest',
  title: 'Lead Engineer',
  username: 'dexter',
  isGuest: true,
  theme: 'light',
  accentColor: '#f26b38',
  createdAt: new Date().toISOString(),
};

const INITIAL_MOCK_WORKSPACE: Workspace = {
  id: 'mock-ws-1',
  name: 'Dexter Workspace',
  ownerId: 'mock-user-1',
  createdAt: new Date().toISOString(),
};

const INITIAL_MOCK_PROJECTS: Project[] = [
  { id: 'mock-proj-1', name: 'Core Platform', workspaceId: 'mock-ws-1', createdAt: new Date().toISOString() },
  { id: 'mock-proj-2', name: 'Frontend App', workspaceId: 'mock-ws-1', createdAt: new Date().toISOString() },
];

const INITIAL_MOCK_LABELS: Label[] = [
  { id: 'lbl-1', name: 'Deployment', color: '#ec4899', workspaceId: 'mock-ws-1' },
  { id: 'lbl-2', name: 'Frontend', color: '#3b82f6', workspaceId: 'mock-ws-1' },
  { id: 'lbl-3', name: 'Backend', color: '#10b981', workspaceId: 'mock-ws-1' },
];

const INITIAL_MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Configure Next.js 14 App Router & Tailwind CSS',
    description: 'Set up global CSS variables, theme providers, and dashboard shell layout.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    position: 0,
    projectId: 'mock-proj-1',
    reporterId: 'mock-user-1',
    reporter: INITIAL_MOCK_USER,
    members: [INITIAL_MOCK_USER],
    labels: [INITIAL_MOCK_LABELS[1]],
    teams: ['Frontend Engineering'],
    subtasks: [
      {
        id: 'sub-1',
        taskId: 'task-1',
        title: 'Create ThemeProvider & CSS variables',
        priority: 'high',
        position: 0,
        createdAt: new Date().toISOString(),
      },
    ],
    comments: [
      {
        id: 'cmt-1',
        taskId: 'task-1',
        authorId: 'mock-user-1',
        author: INITIAL_MOCK_USER,
        content: 'System updated status to completed',
        type: 'system_update',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Implement Guest Auth & Dynamic Kanban Drag and Drop',
    description: 'Allow guest users to manage tasks across To Do, Doing, Completed, and On Hold columns.',
    status: 'doing',
    priority: 'urgent',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    position: 0,
    projectId: 'mock-proj-1',
    reporterId: 'mock-user-1',
    reporter: INITIAL_MOCK_USER,
    members: [INITIAL_MOCK_USER],
    labels: [INITIAL_MOCK_LABELS[0], INITIAL_MOCK_LABELS[2]],
    teams: ['Core Engineering'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Add Collapsible Status Grouped List View',
    description: 'Display table columns for Priority, Members, Due Date, and Actions per status section.',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    position: 0,
    projectId: 'mock-proj-1',
    reporterId: 'mock-user-1',
    reporter: INITIAL_MOCK_USER,
    members: [INITIAL_MOCK_USER],
    labels: [INITIAL_MOCK_LABELS[1]],
    teams: ['Frontend Engineering'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Design Settings Shell (Profile, Theme & Color Pickers)',
    description: 'Support independent light/dark theme switching and dynamic brand accent color picking.',
    status: 'on_hold',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    position: 0,
    projectId: 'mock-proj-1',
    reporterId: 'mock-user-1',
    reporter: INITIAL_MOCK_USER,
    members: [INITIAL_MOCK_USER],
    labels: [INITIAL_MOCK_LABELS[0]],
    teams: ['Design & Product'],
    subtasks: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  // If operating in mock session mode, bypass network fetch to avoid browser ERR_CONNECTION_REFUSED logs
  if (token?.startsWith('mock-')) {
    return handleOfflineFallback<T>(endpoint, options);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData?.error?.message || errorData?.message || `HTTP error ${res.status}`;
      throw new Error(message);
    }

    return await res.json();
  } catch (err: any) {
    return handleOfflineFallback<T>(endpoint, options);
  }
}

function handleOfflineFallback<T>(endpoint: string, options: RequestInit): T {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // Auth Guest
  if (endpoint === '/auth/guest' && method === 'POST') {
    const user: User = {
      ...INITIAL_MOCK_USER,
      fullName: body.fullName || 'Guest User',
    };
    const mockToken = 'mock-jwt-guest-token-' + Date.now();
    setMockStorage(MOCK_STORAGE_KEYS.USER, user);
    if (!localStorage.getItem(MOCK_STORAGE_KEYS.TASKS)) {
      setMockStorage(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    }
    if (!localStorage.getItem(MOCK_STORAGE_KEYS.PROJECTS)) {
      setMockStorage(MOCK_STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS);
    }
    if (!localStorage.getItem(MOCK_STORAGE_KEYS.LABELS)) {
      setMockStorage(MOCK_STORAGE_KEYS.LABELS, INITIAL_MOCK_LABELS);
    }
    return { accessToken: mockToken, user } as unknown as T;
  }

  // Users Me
  if (endpoint === '/users/me' && method === 'GET') {
    return getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER) as unknown as T;
  }

  if (endpoint === '/users/me' && method === 'PATCH') {
    const current = getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER);
    const updated = { ...current, ...body };
    setMockStorage(MOCK_STORAGE_KEYS.USER, updated);
    return updated as unknown as T;
  }

  if (endpoint === '/users/me/settings' && method === 'PATCH') {
    const current = getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER);
    const updated = { ...current, ...body };
    setMockStorage(MOCK_STORAGE_KEYS.USER, updated);
    return updated as unknown as T;
  }

  // Workspace
  if (endpoint === '/workspace') {
    return INITIAL_MOCK_WORKSPACE as unknown as T;
  }

  // Projects
  if (endpoint === '/projects' && method === 'GET') {
    return getMockStorage<Project[]>(MOCK_STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS) as unknown as T;
  }

  if (endpoint === '/projects' && method === 'POST') {
    const projects = getMockStorage<Project[]>(MOCK_STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS);
    const newProject: Project = {
      id: 'mock-proj-' + Date.now(),
      name: body.name,
      workspaceId: 'mock-ws-1',
      createdAt: new Date().toISOString(),
    };
    const updated = [...projects, newProject];
    setMockStorage(MOCK_STORAGE_KEYS.PROJECTS, updated);
    return newProject as unknown as T;
  }

  // Labels
  if (endpoint === '/labels' && method === 'GET') {
    return getMockStorage<Label[]>(MOCK_STORAGE_KEYS.LABELS, INITIAL_MOCK_LABELS) as unknown as T;
  }

  // Tasks
  if (endpoint.startsWith('/tasks') && method === 'GET') {
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    if (endpoint.includes('/tasks/')) {
      const id = endpoint.split('/tasks/')[1].split('/')[0];
      const found = tasks.find((t) => t.id === id);
      if (found) return found as unknown as T;
      return tasks[0] as unknown as T;
    }
    return tasks as unknown as T;
  }

  if (endpoint === '/tasks' && method === 'POST') {
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const user = getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER);
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title: body.title,
      description: body.description || '',
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      position: tasks.filter((t) => t.status === (body.status || 'todo')).length,
      projectId: body.projectId || 'mock-proj-1',
      reporterId: user.id,
      reporter: user,
      members: [user],
      labels: INITIAL_MOCK_LABELS.slice(0, 1),
      teams: ['Core Engineering'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    setMockStorage(MOCK_STORAGE_KEYS.TASKS, updated);
    return newTask as unknown as T;
  }

  if (endpoint.startsWith('/tasks/') && method === 'PATCH') {
    const id = endpoint.split('/tasks/')[1].split('/')[0];
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const user = getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER);
    let updatedTask: Task | null = null;
    const updatedTasks = tasks.map((t) => {
      if (t.id === id) {
        const changes: string[] = [];
        if (body.status && body.status !== t.status) changes.push(`changed status from ${t.status} to ${body.status}`);
        if (body.priority && body.priority !== t.priority) changes.push(`changed priority from ${t.priority} to ${body.priority}`);

        const newComments = [...(t.comments || [])];
        if (changes.length > 0) {
          newComments.push({
            id: 'cmt-' + Date.now(),
            taskId: id,
            authorId: user.id,
            author: user,
            content: changes.join(' and '),
            type: 'system_update',
            createdAt: new Date().toISOString(),
          });
        }

        updatedTask = {
          ...t,
          ...body,
          comments: newComments,
          updatedAt: new Date().toISOString(),
        };
        return updatedTask;
      }
      return t;
    });

    setMockStorage(MOCK_STORAGE_KEYS.TASKS, updatedTasks);
    return (updatedTask || tasks[0]) as unknown as T;
  }

  if (endpoint.startsWith('/tasks/') && method === 'DELETE') {
    const id = endpoint.split('/tasks/')[1];
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const updated = tasks.filter((t) => t.id !== id);
    setMockStorage(MOCK_STORAGE_KEYS.TASKS, updated);
    return { deleted: true } as unknown as T;
  }

  // Subtasks
  if (endpoint.includes('/subtasks') && method === 'POST') {
    const taskId = endpoint.split('/tasks/')[1].split('/subtasks')[0];
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const newSubtask: Subtask = {
      id: 'sub-' + Date.now(),
      taskId,
      title: body.title,
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      position: 0,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...(t.subtasks || []), newSubtask],
        };
      }
      return t;
    });
    setMockStorage(MOCK_STORAGE_KEYS.TASKS, updatedTasks);
    return newSubtask as unknown as T;
  }

  // Comments
  if (endpoint.includes('/comments') && method === 'GET') {
    const taskId = endpoint.split('/tasks/')[1].split('/comments')[0];
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const found = tasks.find((t) => t.id === taskId);
    return (found?.comments || []) as unknown as T;
  }

  if (endpoint.includes('/comments') && method === 'POST') {
    const taskId = endpoint.split('/tasks/')[1].split('/comments')[0];
    const tasks = getMockStorage<Task[]>(MOCK_STORAGE_KEYS.TASKS, INITIAL_MOCK_TASKS);
    const user = getMockStorage<User>(MOCK_STORAGE_KEYS.USER, INITIAL_MOCK_USER);
    const newComment: Comment = {
      id: 'cmt-' + Date.now(),
      taskId,
      authorId: user.id,
      author: user,
      content: body.content,
      type: 'comment',
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
      }
      return t;
    });
    setMockStorage(MOCK_STORAGE_KEYS.TASKS, updatedTasks);
    return newComment as unknown as T;
  }

  return {} as T;
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
