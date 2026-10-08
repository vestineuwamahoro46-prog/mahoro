import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Users,
  FileText,
  Newspaper,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  Loader2
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';
import type { PlatformStats, AuditLog, ResearchProject } from '../../types/research.js';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [recentResearch, setRecentResearch] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then((data) => {
        setStats(data.stats);
        setAuditLogs(data.auditLogs);
        setRecentResearch(data.recentResearch);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Loading directorate telemetry...</span>
      </div>
    );
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-stone-500 font-mono">
            Executive Directorate
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-0.5">
            {getTimeGreeting()}, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            System overview for active empirical studies, data ingestion, and publication status.
          </p>
        </div>

        {/* Quick Actions (Requested in Section 24!) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/admin/research/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Research</span>
          </button>
          <button
            onClick={() => navigate('/admin/blog/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>New Blog Post</span>
          </button>
          <button
            onClick={() => navigate('/admin/news/new')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
          >
            <Newspaper className="w-3.5 h-3.5 text-stone-500" />
            <span>News Article</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Total Research Studies</span>
            <BookOpen className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
            {stats?.totalResearch || 0}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>{stats?.closedResearch || 0} archived / closed</span>
            <span className="font-mono text-emerald-700">Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Active Research Surveys</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 tabular-nums">
            {stats?.activeResearch || 0}
          </div>
          <div className="text-[11px] text-stone-500">
            Accepting live respondent data
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Total Responses Collected</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
            {stats?.totalResponses || 0}
          </div>
          <div className="text-[11px] text-stone-500 flex items-center justify-between">
            <span>+{stats?.responsesThisWeek || 0} this week</span>
            <span className="font-mono text-stone-700">{stats?.avgCompletionRate || 100}% rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium">Published Articles</span>
            <FileText className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-stone-950 tabular-nums">
            {(stats?.publishedNews || 0) + (stats?.publishedBlogs || 0)}
          </div>
          <div className="text-[11px] text-stone-500">
            {stats?.publishedNews || 0} news · {stats?.publishedBlogs || 0} blog essays
          </div>
        </div>
      </div>

      {/* Grid: Response Trends and Recent Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Studies list */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-serif font-semibold text-stone-900">
              Active Research Studies
            </h2>
            <button
              onClick={() => navigate('/admin/research')}
              className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentResearch.map((proj) => (
              <div key={proj.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] text-stone-500 flex items-center gap-2">
                    <span className="font-medium text-stone-700">{proj.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{proj.estimatedTime}</span>
                  </div>
                  <h3
                    onClick={() => navigate(`/admin/research/${proj.id}`)}
                    className="text-sm font-medium text-stone-900 hover:text-stone-700 cursor-pointer truncate mt-0.5"
                  >
                    {proj.title}
                  </h3>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Lead: {proj.researcherName}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-medium text-stone-700 bg-stone-100 px-2 py-1 rounded">
                    {proj.responseCount || 0} resps
                  </span>
                  <button
                    onClick={() => navigate(`/admin/results/${proj.id}`)}
                    className="px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-100 border border-stone-200 rounded cursor-pointer"
                  >
                    Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity / Audit Log */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-base font-serif font-semibold text-stone-900">
              Audit Logs & Recent Activity
            </h2>
            <span className="text-[11px] font-mono text-stone-400">Security Verified</span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="text-xs text-stone-400 py-6 text-center">No recent audit logs</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{log.userName}</span>
                    <span className="font-mono text-[10px] text-stone-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-snug">{log.details}</p>
                  <div className="text-[10px] font-mono text-stone-400 flex items-center justify-between pt-0.5">
                    <span>{log.action}</span>
                    <span>{log.entityType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
