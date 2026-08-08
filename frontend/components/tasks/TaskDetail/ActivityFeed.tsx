'use client';

import { Activity } from 'lucide-react';
import React from 'react';
import { Comment } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

interface ActivityFeedProps {
  comments?: Comment[];
}

export function ActivityFeed({ comments = [] }: ActivityFeedProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4 my-6">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
        <Activity className="w-4 h-4 text-[var(--muted-text)]" /> Activity & Comments ({comments.length})
      </h4>

      <div className="space-y-3">
        {comments.map((item) => {
          if (item.type === 'system_update') {
            return (
              <div key={item.id} className="flex items-center space-x-2 text-xs text-[var(--muted-text)] py-1 pl-3 border-l-2 border-[var(--card-border)]">
                <span className="font-semibold text-[var(--foreground)]">
                  {item.author?.fullName || 'System'}
                </span>
                <span>{item.content}</span>
                <span className="text-[10px] opacity-70">• {formatDate(item.createdAt)}</span>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xs"
            >
              <Avatar
                name={item.author?.fullName || 'User'}
                src={item.author?.avatarUrl}
                size="sm"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    {item.author?.fullName || 'User'}
                  </span>
                  <span className="text-[10px] text-[var(--muted-text)]">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">{item.content}</p>
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <div className="text-xs text-[var(--muted-text)] italic py-2">
            No activity or comments recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
