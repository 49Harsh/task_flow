'use client';

import { MoreHorizontal, RefreshCw } from 'lucide-react';
import React from 'react';
import { Comment } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

interface ActivityFeedProps {
  comments?: Comment[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ActivityFeed({ comments = [] }: ActivityFeedProps) {
  const userComments = comments.filter((c) => c.type === 'comment');
  const systemUpdates = comments.filter((c) => c.type === 'system_update');

  return (
    <div className="space-y-6">
      {/* User comments — shown under a "Subtasks" heading in screenshot */}
      {userComments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[var(--foreground)]">Subtasks</h4>
          {userComments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 p-3 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)]">
              <Avatar name={c.author?.fullName || 'User'} src={c.author?.avatarUrl} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--foreground)]">
                      {c.author?.fullName || 'User'}
                    </span>
                    <span className="text-xs text-[var(--muted-text)]">{timeAgo(c.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--muted-text)]">
                    <button className="p-1 hover:text-[var(--foreground)] rounded">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:text-[var(--foreground)] rounded">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[var(--foreground)]">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System updates — "Updates" section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[var(--foreground)]">Updates</h4>
        {systemUpdates.length === 0 && userComments.length === 0 && (
          <p className="text-xs text-[var(--muted-text)]">No activity yet.</p>
        )}
        {systemUpdates.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <Avatar name={c.author?.fullName || 'You'} src={c.author?.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  {c.author?.fullName || 'You'}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-text)] truncate">{c.content}</p>
              <span className="text-[11px] text-[var(--muted-text)]">
                posted an update · {new Date(c.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
