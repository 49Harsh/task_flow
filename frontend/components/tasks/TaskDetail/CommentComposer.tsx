'use client';

import { Paperclip, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Avatar } from '../../ui/Avatar';

interface CommentComposerProps {
  onSendComment: (content: string) => Promise<void>;
}

export function CommentComposer({ onSendComment }: CommentComposerProps) {
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
      className="flex items-start space-x-3 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xs mt-4"
    >
      <Avatar name={user?.fullName || 'User'} src={user?.avatarUrl} size="sm" />
      <div className="flex-1 space-y-2">
        <textarea
          rows={2}
          placeholder="Leave a reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-xs bg-transparent text-[var(--foreground)] placeholder-[var(--muted-text)] focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-2">
          <button
            type="button"
            className="p-1 rounded text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 accent-bg text-white rounded-md text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span>{loading ? 'Sending...' : 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </form>
  );
}
