'use client';

import { ArrowLeft, Palette, Search, SunMoon, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function SettingsNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Profile', href: '/settings/profile', icon: User },
    { label: 'Theme', href: '/settings/theme', icon: SunMoon },
    { label: 'Color', href: '/settings/color', icon: Palette },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[var(--card-border)] bg-[var(--sidebar-bg)] p-4 space-y-4">
      {/* Back to App Link */}
      <Link
        href="/tasks"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to app</span>
      </Link>

      <h2 className="text-lg font-bold text-[var(--foreground)]">Settings</h2>

      {/* Search box inside settings */}
      <div className="relative w-full">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
        <input
          type="text"
          placeholder="Search settings..."
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-md text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-color)]"
        />
      </div>

      {/* Nav List */}
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? 'accent-bg text-white shadow-xs'
                  : 'text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
