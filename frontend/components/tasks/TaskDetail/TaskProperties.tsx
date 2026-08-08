'use client';

import { Calendar, ExternalLink, Plus, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { Label, User as UserType } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

interface TaskPropertiesProps {
  assignees?: UserType[];
  dueDate?: string;
  labels?: Label[];
  resourceLinks?: string[];
  onAddResourceLink?: (link: string) => void;
}

export function TaskProperties({
  assignees = [],
  dueDate,
  labels = [],
  resourceLinks = [],
  onAddResourceLink,
}: TaskPropertiesProps) {
  const [newLink, setNewLink] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  const formatDate = (d?: string) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.trim()) return;
    onAddResourceLink?.(newLink.trim());
    setNewLink('');
    setIsAddingLink(false);
  };

  const ROW = 'flex items-start gap-4 py-2 border-b border-[var(--card-border)] last:border-0 text-sm';
  const LABEL_COL = 'w-28 shrink-0 text-[var(--muted-text)] font-normal pt-0.5';

  return (
    <div className="divide-y divide-[var(--card-border)] text-sm">
      {/* Properties row: assignee + due date */}
      <div className={ROW}>
        <span className={LABEL_COL}>Properties</span>
        <div className="flex items-center gap-3 flex-wrap">
          {assignees.map((u) => (
            <div key={u.id} className="flex items-center gap-1.5">
              <Avatar name={u.fullName} src={u.avatarUrl} size="sm" />
            </div>
          ))}
          {dueDate && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
              <Calendar className="w-3 h-3" />
              {formatDate(dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Labels row */}
      <div className={ROW}>
        <span className={LABEL_COL}>Labels</span>
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {labels.length > 0 ? (
            labels.map((lbl, idx) => (
              <span
                key={`${lbl.id}-${idx}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[var(--column-bg)] text-[var(--foreground)]"
              >
                <Tag className="w-2.5 h-2.5 shrink-0" style={{ color: lbl.color }} />
                {lbl.name}
              </span>
            ))
          ) : (
            <span className="text-[var(--muted-text)] text-xs">No labels</span>
          )}
        </div>
      </div>

      {/* Resources row */}
      <div className={ROW}>
        <span className={LABEL_COL}>Resources</span>
        <div className="flex flex-col gap-1 pt-0.5">
          {resourceLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.startsWith('http') ? link : `https://${link}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {link}
            </a>
          ))}

          {isAddingLink ? (
            <form onSubmit={handleAddLink} className="flex gap-1">
              <input
                type="text"
                placeholder="https://..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                autoFocus
                className="flex-1 px-2 py-1 text-xs bg-[var(--column-bg)] border border-[var(--card-border)] rounded text-[var(--foreground)] focus:outline-none"
              />
              <button type="submit" className="px-2 py-1 accent-bg text-white rounded text-xs font-medium">
                Add
              </button>
              <button type="button" onClick={() => setIsAddingLink(false)} className="px-2 py-1 text-xs text-[var(--muted-text)]">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingLink(true)}
              className="flex items-center gap-1 text-xs text-[var(--muted-text)] hover:text-[var(--foreground)]"
            >
              <span>@ Add document or link...</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
