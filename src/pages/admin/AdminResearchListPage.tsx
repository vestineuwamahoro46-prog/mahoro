import React, { useState, useEffect } from 'react';
import {
  Plus,
  Copy,
  Edit3,
  Trash2,
  ExternalLink,
  BarChart3,
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api.js';
import type { ResearchProject, ResearchStatus } from '../../types/research.js';
import { useAuth } from '../../context/AuthContext.js';

interface AdminResearchListPageProps {
  navigate: (path: string) => void;
}

export const AdminResearchListPage: React.FC<AdminResearchListPageProps> = ({ navigate }) => {
  const { hasRole } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const canEdit = hasRole('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR');
  const canDelete = hasRole('SUPER_ADMIN', 'ADMIN');

  const loadProjects = () => {
    setLoading(true);
    api.getAdminResearch({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: search.trim() ? search.trim() : undefined,
    })
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, [statusFilter, search]);

  const handleDuplicate = async (id: string) => {
    setActionInProgress(id);
    try {
      const duplicated = await api.duplicateResearch(id);
      loadProjects();
      navigate(`/admin/research/${duplicated.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate project.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ResearchStatus) => {
    setActionInProgress(id);
    try {
      await api.setResearchStatus(id, newStatus);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" and all its questions and responses?`)) {
      return;
    }
    setActionInProgress(id);
    try {
      await api.deleteResearch(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete research project.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Research Studies & Questionnaires
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, duplicate, publish, and analyze empirical studies in the platform.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => navigate('/admin/research/new')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Study</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search studies by title, lead researcher, category..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-800"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 py-2 px-3 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PUBLISHED">Published / Active</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Studies Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs">Loading studies...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-500">
            No research projects match the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <tr>
                  <th className="p-4 font-semibold">Study Title & Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Responses</th>
                  <th className="p-4 font-semibold">Lead Investigator</th>
                  <th className="p-4 font-semibold">Published</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {projects.map((proj) => {
                  const isBusy = actionInProgress === proj.id;
                  return (
                    <tr key={proj.id} className="hover:bg-stone-50/50">
                      <td className="p-4 max-w-sm">
                        <span className="text-[10px] text-stone-500 block font-medium">
                          {proj.category}
                        </span>
                        <span
                          onClick={() => navigate(`/admin/research/${proj.id}`)}
                          className="font-medium text-stone-900 hover:text-stone-700 cursor-pointer block leading-snug"
                        >
                          {proj.title}
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          Est. {proj.estimatedTime}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                            proj.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : proj.status === 'DRAFT'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : proj.status === 'CLOSED'
                              ? 'bg-stone-100 text-stone-700 border border-stone-300'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate(`/admin/results/${proj.id}`)}
                          className="font-mono font-medium text-stone-900 hover:underline cursor-pointer"
                        >
                          {proj.responseCount || 0}
                        </button>
                      </td>

                      <td className="p-4 text-stone-700">
                        {proj.researcherName}
                      </td>

                      <td className="p-4 text-stone-500 font-mono text-[11px]">
                        {proj.publishedAt ? new Date(proj.publishedAt).toLocaleDateString() : '—'}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Results / Analytics */}
                          <button
                            onClick={() => navigate(`/admin/results/${proj.id}`)}
                            title="View statistical results"
                            className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>

                          {/* Builder / Edit */}
                          {canEdit && (
                            <button
                              onClick={() => navigate(`/admin/research/${proj.id}`)}
                              title="Edit questionnaire structure"
                              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Duplicate Research (Section 12 requirement!) */}
                          {canEdit && (
                            <button
                              onClick={() => handleDuplicate(proj.id)}
                              disabled={isBusy}
                              title="Duplicate Research Project"
                              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          )}

                          {/* Preview Public */}
                          <button
                            onClick={() => navigate(`/research/${proj.slug || proj.id}`)}
                            title="Preview public study page"
                            className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {/* Publish / Unpublish / Close toggles */}
                          {canEdit && proj.status === 'DRAFT' && (
                            <button
                              onClick={() => handleStatusChange(proj.id, 'PUBLISHED')}
                              disabled={isBusy}
                              title="Publish study"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {canEdit && proj.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleStatusChange(proj.id, 'CLOSED')}
                              disabled={isBusy}
                              title="Close submissions"
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {canEdit && proj.status === 'CLOSED' && (
                            <button
                              onClick={() => handleStatusChange(proj.id, 'PUBLISHED')}
                              disabled={isBusy}
                              title="Reopen submissions"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(proj.id, proj.title)}
                              disabled={isBusy}
                              title="Delete project"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
