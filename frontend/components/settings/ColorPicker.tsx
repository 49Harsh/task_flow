'use client';

import { Check } from 'lucide-react';
import React from 'react';
import { ACCENT_PRESETS, useTheme } from '../../context/ThemeContext';
import { api } from '../../lib/api';

export function ColorPicker() {
  const { accentColor, setAccentColor } = useTheme();

  const handleSelectColor = async (colorHex: string) => {
    setAccentColor(colorHex);
    try {
      await api.updateSettings({ accentColor: colorHex });
    } catch (e) {
      console.warn('Failed to sync accent color with backend:', e);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--foreground)]">Accent Color</h3>
        <p className="text-xs text-[var(--muted-text)]">
          Select your preferred brand accent color used across buttons, highlights, and active tabs.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ACCENT_PRESETS.map((color) => {
          const isSelected = accentColor.toLowerCase() === color.toLowerCase();
          return (
            <div
              key={color}
              onClick={() => handleSelectColor(color)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                isSelected
                  ? 'border-[var(--foreground)] bg-[var(--card-bg)] shadow-md ring-2 ring-slate-400'
                  : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-slate-400'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: color }}
              >
                {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
              <span className="text-xs font-mono text-[var(--foreground)]">{color}</span>
            </div>
          );
        })}
      </div>

      {/* Custom Color Input */}
      <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
          Custom Hex Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => handleSelectColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0"
          />
          <input
            type="text"
            value={accentColor}
            onChange={(e) => handleSelectColor(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md font-mono text-[var(--foreground)]"
          />
        </div>
      </div>
    </div>
  );
}
