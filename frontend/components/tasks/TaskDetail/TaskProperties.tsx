'use client';

import { ExternalLink, Link as LinkIcon, Plus, Tag, User } from 'lucide-react';
import React, { useState } from 'react';
import { Label, User as UserType } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

interface TaskPropertiesProps {
  assignees?: UserType[];
  labels?: Label[];
  resourceLinks?: string[];
  onAddResourceLink?: (link: string) => void;
}

export function TaskProperties({
  assignees = [],
  labels = [],
  resourceLinks = [],
  onAddResourceLink,
}: TaskPropertiesProps) {
  const [newLink, setNewLink] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  const handleAddLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.trim()) return;
    onAddResourceLink?.(newLink.trim());
    setNewLink('');
    setIsAddingLink(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[var(--background)] border border-[var(--card-border)] rounded-xl my-4 text-xs">
      {/* Assignees */}
      <div className="space-y-1.5">
        <span className="font-semibold uppercase tracking-wider text-[var(--muted-text)] flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Assignees
        </span>
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {assignees.length > 0 ? (
            assignees.map((user) => (
              <div key={user.id} className="flex items-center gap-1.5 bg-[var(--card-bg)] px-2 py-1 rounded border border-[var(--card-border)]">
                <Avatar name={user.fullName} src={user.avatarUrl} size="sm" />
                <span className="font-medium text-[var(--foreground)]">{user.fullName}</span>
              </div>
            ))
          ) : (
            <span className="text-[var(--muted-text)] italic">Unassigned</span>
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-1.5">
        <span className="font-semibold uppercase tracking-wider text-[var(--muted-text)] flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Labels
        </span>
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {labels.length > 0 ? (
            labels.map((lbl) => (
              <span
                key={lbl.id}
                className="px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                style={{ backgroundColor: lbl.color || '#3b82f6' }}
              >
                {lbl.name}
              </span>
            ))
          ) : (
            <span className="text-[var(--muted-text)] italic">No labels</span>
          )}
        </div>
      </div>

      {/* Resource Links */}
      <div className="space-y-1.5">
        <span className="font-semibold uppercase tracking-wider text-[var(--muted-text)] flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5" /> Resources & Links
        </span>
        <div className="space-y-1 pt-0.5">
          {resourceLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.startsWith('http') ? link : `https://${link}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[var(--accent-color)] hover:underline truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{link}</span>
            </a>
          ))}

          {isAddingLink ? (
            <form onSubmit={handleAddLinkSubmit} className="flex gap-1 mt-1">
              <input
                type="text"
                placeholder="https://..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                autoFocus
                className="flex-1 px-2 py-1 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded text-[var(--foreground)]"
              />
              <button
                type="submit"
                className="px-2 py-1 accent-bg text-white rounded font-medium text-[10px]"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingLink(true)}
              className="flex items-center gap-1 text-[var(--muted-text)] hover:text-[var(--foreground)] text-[11px]"
            >
              <Plus className="w-3 h-3" /> Add Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
