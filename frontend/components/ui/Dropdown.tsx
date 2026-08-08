'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, children, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const alignStyles = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${alignStyles} mt-2 w-56 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg shadow-xl z-50 py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-100`}
        >
          {children
            ? children
            : items?.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm text-left transition-colors ${
                    item.danger
                      ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                      : 'text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <span className="mr-2 text-[var(--muted-text)]">{item.icon}</span>}
                  {item.label}
                </button>
              ))}
        </div>
      )}
    </div>
  );
}
