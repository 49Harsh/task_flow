'use client';

import { CheckSquare, ChevronDown, FolderKanban, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, workspace, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const navItems = [
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  const workspaceName = workspace?.name || user?.fullName || 'Workspace';

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Workspace Header */}
      <div className={`flex items-center gap-2.5 px-4 py-3.5 border-b border-[var(--sidebar-border)] ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          <Link href="/settings/profile" className="w-7 h-7 rounded-md accent-bg flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {workspaceName[0]?.toUpperCase() || 'W'}
          </Link>
        ) : (
          <>
            <Link href="/settings/profile">
              <Avatar name={workspaceName} src={workspace?.avatarUrl} size="sm" />
            </Link>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-[var(--foreground)] truncate block leading-tight">
                {user?.fullName?.split(' ')[0] || workspaceName}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-text)] shrink-0" />
          </>
        )}
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
        {!collapsed && (
          <>
            {/* Workspace Section Label */}
            <button
              onClick={() => setWorkspaceOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            >
              <span>Workspace</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${workspaceOpen ? '' : '-rotate-90'}`}
              />
            </button>

            {workspaceOpen && (
              <div className="space-y-0.5 mt-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--hover-bg-strong)] text-[var(--foreground)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--hover-bg)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-[var(--muted-text)]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Collapsed Nav */}
        {collapsed && (
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center justify-center p-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-[var(--hover-bg)] text-[var(--foreground)]'
                      : 'text-[var(--muted-text)] hover:bg-[var(--hover-bg)]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-[var(--sidebar-border)] space-y-0.5">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
          } rounded-md text-sm text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors`}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          {!collapsed && <span className="text-xs">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {user && (
          <button
            onClick={logout}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-1.5'
            } rounded-md text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-xs">Logout</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
