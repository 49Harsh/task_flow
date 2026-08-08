'use client';

import { Send, Smile } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../ui/Avatar';

interface CommentComposerProps {
  onSendComment: (content: string) => Promise<void>;
  placeholder?: string;
}

export function CommentComposer({ onSendComment, placeholder = 'Add a comment...' }: CommentComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSendComment(content.trim());
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-3 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)]"
    >
      <Avatar name={user?.fullName || 'User'} src={user?.avatarUrl} size="sm" />
      <input
        type="text"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 text-sm bg-transparent text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none"
      />
      <div className="flex items-center gap-1.5 shrink-0">
        <button type="button" className="p-1 text-[var(--muted-text)] hover:text-[var(--foreground)]">
          <Smile className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="p-1 text-[var(--muted-text)] hover:text-[var(--accent-color)] disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
