'use client';

import { LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-11 sticky top-0 z-20 flex items-center justify-between px-4 bg-[var(--card-bg)] border-b border-[var(--card-border)]">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
          title="Toggle Sidebar"
        >
          <LayoutTemplate className="w-4 h-4" />
        </button>
      </div>

      {user && (
        <Link href="/settings/profile" className="flex items-center gap-2">
          <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
        </Link>
      )}
    </header>
  );
}
