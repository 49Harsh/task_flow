'use client';

import { SlidersHorizontal } from 'lucide-react';
import React from 'react';
import { CardFieldsVisibility } from '../../lib/types';
import { Dropdown } from '../ui/Dropdown';

interface FieldsDropdownProps {
  fields: CardFieldsVisibility;
  onChange: (fields: CardFieldsVisibility) => void;
}

export function FieldsDropdown({ fields, onChange }: FieldsDropdownProps) {
  const toggleField = (key: keyof CardFieldsVisibility) => {
    onChange({
      ...fields,
      [key]: !fields[key],
    });
  };

  const fieldList: { key: keyof CardFieldsVisibility; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <Dropdown
      trigger={
        <div className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--muted-text)]" />
          <span>Fields</span>
        </div>
      }
    >
      <div className="p-2 space-y-1 w-48">
        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)] border-b border-[var(--card-border)] pb-2 mb-1">
          Toggle Visible Fields
        </div>
        {fieldList.map((f) => (
          <label
            key={f.key}
            className="flex items-center space-x-2.5 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs text-[var(--foreground)]"
          >
            <input
              type="checkbox"
              checked={fields[f.key]}
              onChange={() => toggleField(f.key)}
              className="rounded border-[var(--card-border)] accent-[var(--accent-color)]"
            />
            <span>{f.label}</span>
          </label>
        ))}
      </div>
    </Dropdown>
  );
}
