'use client';

import { Bell, Menu, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface TopbarProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Topbar({ onToggleSidebar, searchQuery = '', onSearchChange }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-14 sticky top-0 z-20 flex items-center justify-between px-4 bg-[var(--card-bg)] border-b border-[var(--card-border)] backdrop-blur-xs">
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative max-w-xs w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 accent-bg rounded-full" />
        </button>

        <Link
          href="/settings/profile"
          className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {user && (
          <Link href="/settings/profile" className="flex items-center space-x-2 pl-2 border-l border-[var(--card-border)]">
            <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
            <span className="text-xs font-medium text-[var(--foreground)] hidden md:inline">{user.fullName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
