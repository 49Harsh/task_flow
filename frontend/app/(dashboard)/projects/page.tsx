'use client';

import { FolderKanban, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';

export default function ProjectsPage() {
  const { projects, refreshProjects } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.createProject(name.trim());
      await refreshProjects();
      setName('');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Projects</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Workspace projects and engineering streams.
          </p>
        </div>

        <Button onClick={() => setIsOpen(true)} size="sm">
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-2xs space-y-3 hover:border-[var(--accent-color)] transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg accent-bg text-white">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">{proj.name}</h3>
                <span className="text-[11px] text-[var(--muted-text)]">
                  Created {new Date(proj.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[var(--muted-text)]">
            No projects created yet. Click "New Project" to start one.
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name *"
            placeholder="e.g. Core Platform / Web App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
