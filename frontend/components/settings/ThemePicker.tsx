'use client';

import { Check, Moon, Sun } from 'lucide-react';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../lib/api';

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  const handleSelectTheme = async (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
    try {
      await api.updateSettings({ theme: selectedTheme });
    } catch (e) {
      console.warn('Failed to sync theme with backend:', e);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--foreground)]">Theme Settings</h3>
        <p className="text-xs text-[var(--muted-text)]">
          Customize the overall visual interface theme mode.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Light Theme Card */}
        <div
          onClick={() => handleSelectTheme('light')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            theme === 'light'
              ? 'accent-border bg-slate-50 text-slate-900 ring-2 ring-[var(--accent-color)]/20'
              : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold">Light Theme</span>
            </div>
            {theme === 'light' && <Check className="w-5 h-5 accent-text" />}
          </div>
          <p className="text-xs text-slate-500">
            Clean, bright interface designed for daytime productivity.
          </p>
        </div>

        {/* Dark Theme Card */}
        <div
          onClick={() => handleSelectTheme('dark')}
          className={`p-5 rounded-xl border cursor-pointer transition-all ${
            theme === 'dark'
              ? 'accent-border bg-slate-900 text-white ring-2 ring-[var(--accent-color)]/20'
              : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-bold">Dark Theme</span>
            </div>
            {theme === 'dark' && <Check className="w-5 h-5 accent-text" />}
          </div>
          <p className="text-xs text-slate-400">
            Sleek dark interface reducing eye strain in low-light environments.
          </p>
        </div>
      </div>
    </div>
  );
}
