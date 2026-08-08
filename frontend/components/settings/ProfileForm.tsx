'use client';

import { Edit2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function ProfileForm() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [title, setTitle] = useState(user?.title || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMessage('');
    try {
      await api.updateProfile({
        fullName,
        title,
        username,
        avatarUrl,
      });
      await refreshUser();
      setSavedMessage('Profile updated successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h3 className="text-lg font-bold text-[var(--foreground)]">Profile Details</h3>
        <p className="text-xs text-[var(--muted-text)]">
          Manage your account profile details and workspace membership.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl">
          <Avatar name={fullName || user?.fullName || 'User'} src={avatarUrl} size="lg" />
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[var(--foreground)] block">
              Profile Picture
            </span>
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" size="sm">
                <Upload className="w-3.5 h-3.5" /> Upload Image
              </Button>
            </div>
          </div>
        </div>

        {/* Email Read-only Display with Pencil Icon */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)]">
            Email Address
          </label>
          <div className="flex items-center justify-between px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-md text-sm text-[var(--foreground)]">
            <span>{user?.email || 'guest@taskflow.dev'}</span>
            <Edit2 className="w-4 h-4 text-[var(--muted-text)] cursor-pointer hover:text-[var(--foreground)]" />
          </div>
        </div>

        {/* Full Name */}
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Dexter Morgan"
        />

        {/* Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your job title or role (e.g. Lead Engineer)"
          helperText="Your job title or role"
        />

        {/* Username */}
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="One word, like a nickname or first name"
          helperText="One word, like a nickname or first name"
        />

        {savedMessage && <p className="text-xs text-emerald-500 font-semibold">{savedMessage}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </Button>
      </form>

      {/* Workspace Access Card */}
      <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-3">
        <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">Workspace Access</h4>
        <p className="text-xs text-[var(--muted-text)]">
          Remove yourself from the workspace. This action will revoke your access to all projects and tasks.
        </p>
        <Button variant="danger" size="sm">
          Leave Workspace
        </Button>
      </div>
    </div>
  );
}
