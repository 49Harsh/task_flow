'use client';

import React from 'react';
import { SettingsNav } from '../../components/settings/SettingsNav';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--background)]">
      <SettingsNav />
      <main className="flex-1 p-6 md:p-10 max-w-4xl overflow-y-auto">{children}</main>
    </div>
  );
}
