'use client';

import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { guestLogin, user } = useAuth();
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await guestLogin(guestName.trim() || 'Dexter Guest');
      router.push('/tasks');
    } catch (e) {
      console.error('Guest login failed:', e);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      router.push('/tasks');
    }
  }, [user, router]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-orange-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8 bg-slate-900/80 border border-slate-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl accent-bg text-white shadow-lg shadow-orange-500/20 mb-2">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-sm text-slate-400">
            Workspace-based task management for modern engineering teams.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Interactive Kanban Board & Grouped List views</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Full Task Detail panels with subtasks & activity feeds</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Persisted Light/Dark theme & customizable accent colors</span>
          </div>
        </div>

        {/* Guest Entry Form */}
        <form onSubmit={handleGuestSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Dexter Morgan"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 accent-bg text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Setting up Workspace...' : 'Continue as Guest'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>No password required • Instant workspace session</span>
        </div>
      </div>
    </main>
  );
}
