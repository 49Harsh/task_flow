'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Label, Project, User, Workspace } from '../lib/types';
import { useTheme } from './ThemeContext';

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  projects: Project[];
  labels: Label[];
  loading: boolean;
  guestLogin: (fullName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshLabels: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTheme, setAccentColor } = useTheme();

  const fetchWorkspaceAndProjects = async () => {
    try {
      const [ws, projs, lbls] = await Promise.all([
        api.getWorkspace().catch(() => null),
        api.getProjects().catch(() => []),
        api.getLabels().catch(() => []),
      ]);
      if (ws) setWorkspace(ws);
      if (projs) setProjects(projs);
      if (lbls) setLabels(lbls);
    } catch (e) {
      console.error('Failed to fetch workspace/projects:', e);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
      if (me.theme) setTheme(me.theme);
      if (me.accentColor) setAccentColor(me.accentColor);
      await fetchWorkspaceAndProjects();
    } catch (e) {
      console.warn('Failed to load user:', e);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const guestLogin = async (fullName?: string) => {
    setLoading(true);
    try {
      const data = await api.guestLogin(fullName);
      setUser(data.user);
      if (data.user.theme) setTheme(data.user.theme);
      if (data.user.accentColor) setAccentColor(data.user.accentColor);
      await fetchWorkspaceAndProjects();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    setUser(null);
    setWorkspace(null);
    setProjects([]);
  };

  const refreshProjects = async () => {
    const projs = await api.getProjects().catch(() => []);
    setProjects(projs);
  };

  const refreshLabels = async () => {
    const lbls = await api.getLabels().catch(() => []);
    setLabels(lbls);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        projects,
        labels,
        loading,
        guestLogin,
        logout,
        refreshUser,
        refreshProjects,
        refreshLabels,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
