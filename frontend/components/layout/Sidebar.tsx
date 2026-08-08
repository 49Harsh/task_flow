'use client';

import { CheckSquare, ChevronDown, FolderKanban, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  const navItems = [
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Projects', href: '/projects', icon: FolderKanban },
    { label: 'Settings', href: '/settings/profile', icon: Settings },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Workspace Switcher / Logo Header */}
      <div className="p-4">
        {collapsed ? (
          <div className="w-10 h-10 rounded-lg accent-bg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            T
          </div>
        ) : (
          <WorkspaceSwitcher />
        )}
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Workspace Collapsible Section */}
        {!collapsed && (
          <div>
            <button
              onClick={() => setWorkspaceOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)] hover:text-[var(--foreground)]"
            >
              <span>Workspace</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${workspaceOpen ? '' : '-rotate-90'}`} />
            </button>

            {workspaceOpen && (
              <div className="mt-1 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'accent-bg text-white shadow-xs'
                          : 'text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Collapsed Nav */}
        {collapsed && (
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center justify-center p-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'accent-bg text-white shadow-xs'
                      : 'text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Profile & Controls */}
      <div className="p-3 border-t border-[var(--sidebar-border)] space-y-1">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
          } rounded-md text-sm text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {user && (
          <button
            onClick={logout}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
            } rounded-md text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
