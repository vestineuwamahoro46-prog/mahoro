import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, BookOpen, Layers } from 'lucide-react';
import { api } from '../lib/api.js';
import type { ResearchProject } from '../types/research.js';
import { ResearchCard } from '../components/research/ResearchCard.js';

interface ResearchListingPageProps {
  navigate: (path: string) => void;
  surveyModeOnly?: boolean;
}

export const ResearchListingPage: React.FC<ResearchListingPageProps> = ({
  navigate,
  surveyModeOnly = false,
}) => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'time'>('newest');

  useEffect(() => {
    setLoading(true);
    api.getResearchList({
      status: status === 'ALL' ? undefined : status,
      category: category === 'ALL' ? undefined : category,
      search: search.trim() ? search.trim() : undefined,
    })
      .then((data) => setProjects(data))
      .catch((err) => console.error('Failed to load research:', err))
      .finally(() => setLoading(false));
  }, [category, status, search]);

  const categories = [
    { label: 'All Fields', value: 'ALL' },
    { label: 'Financial Crime & Legal Policy', value: 'Financial Crime' },
    { label: 'Sustainable Finance', value: 'Sustainable' },
    { label: 'Fintech & Inclusion', value: 'Technology' },
  ];

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
          {surveyModeOnly ? 'Active Questionnaires' : 'Academic & Institutional Studies'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 mt-1">
          {surveyModeOnly ? 'Live Surveys & Research Tests' : 'Research Projects Directory'}
        </h1>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          Explore empirical research studies conducted across Rwandan institutions, banking sectors, and regulatory agencies. Choose an active project to contribute data or examine research scope.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, target respondent, or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-800"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Active / Open</option>
              <option value="CLOSED">Closed Studies</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-800"
            >
              <option value="newest">Sort: Newest</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs">Loading research registry...</span>
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-stone-200 p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-serif font-medium text-stone-900">No Research Studies Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or filters to find published empirical studies.
          </p>
          <button
            onClick={() => { setSearch(''); setCategory('ALL'); setStatus('ALL'); }}
            className="text-xs text-stone-900 underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ResearchCard
              key={project.id}
              project={project}
              onSelect={(p) => navigate(`/research/${p.slug || p.id}`)}
              onStartSurvey={(p) => navigate(`/survey/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
