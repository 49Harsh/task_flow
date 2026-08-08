'use client';

import React from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name = 'User', src, size = 'md', className = '' }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover border border-[var(--card-border)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size]} rounded-full accent-bg text-white font-medium flex items-center justify-center border border-[var(--card-border)] shadow-xs select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
