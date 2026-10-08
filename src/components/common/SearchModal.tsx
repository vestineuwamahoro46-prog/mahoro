import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Newspaper, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ research: any[]; news: any[]; blog: any[] }>({
    research: [],
    news: [],
    blog: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults({ research: [], news: [], blog: [] });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ research: [], news: [], blog: [] });
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      api.globalSearch(query)
        .then((res) => setResults(res))
        .catch(() => setResults({ research: [], news: [], blog: [] }))
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  const totalHits = results.research.length + results.news.length + results.blog.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-stone-200">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search research studies, AML topics, news, or blog articles..."
            className="w-full py-4 px-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-stone-400 animate-spin mr-2" />}
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-stone-500 space-y-2">
              <p>Type keywords to search across the entire AcuityResearch repository.</p>
              <p className="text-stone-400">Suggestions: "money laundering", "Rwanda", "beneficial ownership", "VASP", "green finance"</p>
            </div>
          ) : totalHits === 0 && !loading ? (
            <div className="py-8 text-center text-stone-500 text-sm">
              No results found for <span className="font-semibold text-stone-800">"{query}"</span>
            </div>
          ) : (
            <>
              {/* Research Studies */}
              {results.research.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                    <span>Research Studies ({results.research.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.research.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(`/research/${item.slug || item.id}`)}
                        className="w-full text-left p-3 rounded-lg hover:bg-stone-50 border border-stone-100 transition-colors flex items-start justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs text-stone-500 font-medium mb-0.5">
                            {item.category} · {item.estimatedTime}
                          </div>
                          <h4 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                            {item.shortDescription}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0 ml-3 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* News Articles */}
              {results.news.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    <Newspaper className="w-3.5 h-3.5 text-stone-700" />
                    <span>Regulatory News ({results.news.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.news.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(`/news/${item.slug || item.id}`)}
                        className="w-full text-left p-3 rounded-lg hover:bg-stone-50 border border-stone-100 transition-colors flex items-start justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs text-stone-500 font-medium mb-0.5">
                            {item.category} · {new Date(item.publishedAt).toLocaleDateString()}
                          </div>
                          <h4 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700">
                            {item.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0 ml-3 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {results.blog.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                    <FileText className="w-3.5 h-3.5 text-stone-700" />
                    <span>Research Essays & Blog ({results.blog.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.blog.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(`/blog/${item.slug || item.id}`)}
                        className="w-full text-left p-3 rounded-lg hover:bg-stone-50 border border-stone-100 transition-colors flex items-start justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs text-stone-500 font-medium mb-0.5">
                            By {item.author} · {item.readingTime}
                          </div>
                          <h4 className="text-sm font-semibold text-stone-900 group-hover:text-stone-700">
                            {item.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0 ml-3 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex justify-between items-center">
          <span>Press ESC to close</span>
          <span className="font-mono text-[11px]">AcuityResearch Global Index</span>
        </div>
      </div>
    </div>
  );
};
