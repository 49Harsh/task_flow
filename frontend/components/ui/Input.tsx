'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', ...props }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 text-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)] accent-ring transition-colors ${className}`}
        {...props}
      />
      {helperText && <p className="text-xs text-[var(--muted-text)]">{helperText}</p>}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
