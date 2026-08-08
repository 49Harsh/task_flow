'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const variantStyles = {
    primary: 'accent-bg text-white hover:opacity-90 shadow-xs',
    secondary: 'bg-[var(--hover-bg-strong)] text-[var(--foreground)] hover:bg-[var(--hover-bg-strong)]',
    outline: 'border border-[var(--card-border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--hover-bg)]',
    ghost: 'bg-transparent text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--hover-bg)]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
