import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Share2, Tag, Loader2, Check } from 'lucide-react';
import { api } from '../lib/api.js';
import type { NewsArticle } from '../types/research.js';

interface NewsDetailPageProps {
  idOrSlug: string;
  navigate: (path: string) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ idOrSlug, navigate }) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getNewsById(idOrSlug)
      .then((data) => setArticle(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Loading news report...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-serif font-semibold text-stone-900">Dispatch Not Found</h2>
        <button
          onClick={() => navigate('/news')}
          className="px-4 py-2 text-xs font-medium bg-stone-100 rounded-md"
        >
          Return to News Listing
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('/news')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Regulatory News</span>
      </button>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span className="text-stone-800 font-semibold">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span aria-hidden="true">·</span>
          <span>{article.author}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-stone-600 leading-relaxed font-serif italic">
            {article.subtitle}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-stone-200">
          <div className="text-xs text-stone-500">
            AcuityResearch Regulatory Affairs Bureau
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200 shadow-sm">
        <img
          src={article.featuredImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="max-w-2xl mx-auto py-4 space-y-6 text-stone-800 leading-relaxed text-base sm:text-lg">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="max-w-2xl mx-auto pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Keywords:</span>
          {article.tags.map((t) => (
            <span key={t} className="text-xs text-stone-700 font-mono">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
