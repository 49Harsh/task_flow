'use client';

import { Check, ChevronDown, Plus, Settings } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Label, TaskPriority, TaskStatus, User as UserType } from '../../../lib/types';
import { Avatar } from '../../ui/Avatar';

// ── colour maps ────────────────────────────────────────────────────────────────
const STATUS_DOT: Record<TaskStatus, string> = {
  todo:      '#94a3b8',
  doing:     '#f59e0b',
  completed: '#10b981',
  on_hold:   '#8b5cf6',
  backlog:   '#f26b38',
};
const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do', doing: 'Doing', completed: 'Completed', on_hold: 'On Hold', backlog: 'Backlog',
};

const PRIORITY_CFG: Record<TaskPriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: '#ef4444' },
  high:   { label: 'High',   color: '#f97316' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low:    { label: 'Low',    color: '#94a3b8' },
};

// ── tiny bar-chart icon for priority ──────────────────────────────────────────
function PriorityIcon({ priority, size = 14 }: { priority: TaskPriority; size?: number }) {
  const { color } = PRIORITY_CFG[priority];
  const bars: Record<TaskPriority, [number, number, number]> = {
    urgent: [10, 7, 4], high: [10, 7, 4], medium: [7, 7, 4], low: [4, 4, 4],
  };
  const [h1, h2, h3] = bars[priority];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="0" y={12 - h1} width="3" height={h1} rx="0.5" fill={color} />
      <rect x="4.5" y={12 - h2} width="3" height={h2} rx="0.5" fill={color} opacity="0.7" />
      <rect x="9" y={12 - h3} width="3" height={h3} rx="0.5" fill={color} opacity="0.4" />
    </svg>
  );
}

// ── row wrapper ────────────────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-[var(--card-border)] last:border-0">
      <span className="text-xs text-[var(--muted-text)] w-20 shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 flex items-center justify-end">{children}</div>
    </div>
  );
}

// ── props ──────────────────────────────────────────────────────────────────────
interface DetailsSidebarProps {
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reporter?: UserType;
  members?: UserType[];
  labels?: Label[];
  teams?: string[];
  onStatusChange: (s: TaskStatus) => void;
  onPriorityChange: (p: TaskPriority) => void;
  onDueDateChange: (d: string) => void;
}

export function DetailsSidebar({
  status, priority, dueDate, reporter, members = [], labels = [], teams = [],
  onStatusChange, onPriorityChange, onDueDateChange,
}: DetailsSidebarProps) {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const priorityRef = useRef<HTMLDivElement>(null);
  const statusRef   = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) setShowPriorityMenu(false);
      if (statusRef.current   && !statusRef.current.contains(e.target as Node))   setShowStatusMenu(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pc = PRIORITY_CFG[priority];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-l border-[var(--card-border)] p-4 bg-[var(--card-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--card-border)]">
        <span className="text-xs font-semibold text-[var(--foreground)]">Details</span>
        <div className="flex items-center gap-0.5 text-[var(--muted-text)]">
          <button className="p-1 rounded hover:text-[var(--foreground)]"><Plus className="w-3.5 h-3.5" /></button>
          <button className="p-1 rounded hover:text-[var(--foreground)]"><Settings className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Rows */}
      <div>
        {/* Status */}
        <Row label="Status">
          <div ref={statusRef} className="relative">
            <button
              onClick={() => setShowStatusMenu((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] hover:opacity-80"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_DOT[status] }} />
              {STATUS_LABEL[status]}
            </button>
            {showStatusMenu && (
              <div className="absolute right-0 top-6 z-50 w-40 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Status</div>
                {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(s); setShowStatusMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--column-bg)] text-[var(--foreground)]"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: STATUS_DOT[s] }} />
                    {STATUS_LABEL[s]}
                    {s === status && <Check className="w-3 h-3 ml-auto text-[var(--accent-color)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Row>

        {/* Priority */}
        <Row label="Priority">
          <div ref={priorityRef} className="relative">
            <button
              onClick={() => setShowPriorityMenu((p) => !p)}
              className="flex items-center gap-1.5 text-xs font-medium hover:opacity-80"
              style={{ color: pc.color }}
            >
              <PriorityIcon priority={priority} />
              {pc.label}
              <ChevronDown className="w-3 h-3 text-[var(--muted-text)]" />
            </button>

            {showPriorityMenu && (
              <div className="absolute right-0 top-6 z-50 w-44 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg py-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Priority</div>
                {/* No Priority option */}
                <button
                  onClick={() => { onPriorityChange('low'); setShowPriorityMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--column-bg)] text-[var(--muted-text)]"
                >
                  <span className="w-3 h-3 flex items-center justify-center text-[var(--muted-text)]">·</span>
                  No Priority
                </button>
                {(Object.keys(PRIORITY_CFG) as TaskPriority[]).map((p) => {
                  const cfg = PRIORITY_CFG[p];
                  return (
                    <button
                      key={p}
                      onClick={() => { onPriorityChange(p); setShowPriorityMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--column-bg)]"
                      style={{ color: cfg.color }}
                    >
                      <PriorityIcon priority={p} size={12} />
                      {cfg.label}
                      {p === priority && <Check className="w-3 h-3 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Row>

        {/* Members */}
        <Row label="Members">
          <div className="flex items-center -space-x-1.5">
            {members.length > 0 ? (
              members.map((m) => <Avatar key={m.id} name={m.fullName} src={m.avatarUrl} size="sm" />)
            ) : (
              <span className="text-xs text-[var(--muted-text)]">—</span>
            )}
          </div>
        </Row>

        {/* Dates */}
        <Row label="Dates">
          <input
            type="date"
            value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="text-xs bg-transparent text-[var(--foreground)] border-none focus:outline-none cursor-pointer"
          />
        </Row>

        {/* Labels */}
        <Row label="Labels">
          <div className="flex flex-wrap gap-1 justify-end">
            {labels.length > 0 ? (
              labels.map((lbl, i) => (
                <span
                  key={`${lbl.id}-${i}`}
                  className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                  style={{ backgroundColor: lbl.color }}
                >
                  {lbl.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--muted-text)]">—</span>
            )}
          </div>
        </Row>

        {/* Teams */}
        <Row label="Teams">
          <div className="flex flex-wrap gap-1 justify-end">
            {teams.length > 0 ? (
              teams.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[var(--column-bg)] text-[var(--foreground)]">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--muted-text)]">—</span>
            )}
          </div>
        </Row>

        {/* Reporter */}
        <Row label="Reporter">
          {reporter ? (
            <div className="flex items-center gap-1.5">
              <Avatar name={reporter.fullName} src={reporter.avatarUrl} size="sm" />
              <span className="text-xs text-[var(--foreground)]">{reporter.fullName}</span>
            </div>
          ) : (
            <span className="text-xs text-[var(--muted-text)]">—</span>
          )}
        </Row>
      </div>
    </aside>
  );
}
