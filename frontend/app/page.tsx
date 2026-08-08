'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { guestLogin, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await guestLogin('Dexter Guest');
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
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 bg-white text-slate-900 selection:bg-slate-100">
      {/* Brand Logo & Name Header */}
      <div className="flex items-center space-x-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shadow-xs">
          {/* Pyramid / Delta Icon matching Figma */}
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3L2 20H22L12 3ZM12 7.8L17.5 17.5H6.5L12 7.8Z" />
          </svg>
        </div>
        <span className="text-base font-extrabold tracking-tight text-slate-900">Pyramid</span>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-[28px] p-8 sm:p-10 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        {/* Header inside Card */}
        <div className="text-center mb-7">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
            Let's get back on track
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Enter your email below to login to your account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Continue as Guest Button */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-3 px-5 bg-[#18181b] hover:bg-black text-white font-semibold text-sm rounded-full transition-all duration-150 cursor-pointer shadow-xs disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? 'Logging in...' : 'Continue as Guest'}
          </button>

          {/* Login with Google Button */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full py-3 px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs"
          >
            {/* Google 'G' Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>
      </div>

      {/* Footer Legal Terms Note */}
      <div className="mt-8 text-center max-w-xs">
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-normal">
          By clicking continue, you agree to
          <br />
          our{' '}
          <a href="#" className="underline hover:text-slate-600 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}
