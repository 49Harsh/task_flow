'use client';

import { ChevronDown, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export function WorkspaceSwitcher() {
  const { workspace, user } = useAuth();

  const workspaceName = workspace?.name || 'Dexter';
  const ownerName = user?.fullName || 'Dexter Workspace';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xs">
      <div className="flex items-center space-x-3 overflow-hidden">
        <Avatar name={workspaceName} size="md" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-[var(--foreground)] truncate">{workspaceName}</span>
          <span className="text-xs text-[var(--muted-text)] truncate">{ownerName}</span>
        </div>
      </div>
      <div className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] cursor-pointer">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
}
