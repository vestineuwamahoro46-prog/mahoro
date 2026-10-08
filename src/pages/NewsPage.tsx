import React, { useState, useEffect } from 'react';
import { ArrowRight, Newspaper, Calendar, Loader2 } from 'lucide-react';
import { api } from '../lib/api.js';
import type { NewsArticle } from '../types/research.js';

interface NewsPageProps {
  navigate: (path: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ navigate }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsList()
      .then((data) => setArticles(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
          Institutional & Regulatory Dispatches
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 mt-1">
          Regulatory News & Fieldwork Updates
        </h1>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          Official news briefings regarding Rwandan financial intelligence, supervisory circulars, institutional partnerships, and AML/CFT research milestones.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs">Loading news dispatches...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              onClick={() => navigate(`/news/${article.slug || article.id}`)}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-400 transition-all cursor-pointer flex flex-col group shadow-2xs"
            >
              <div className="aspect-16/9 bg-stone-100 overflow-hidden relative">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-stone-500 mb-2">
                    <span className="font-semibold text-stone-700">{article.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-lg font-serif font-semibold text-stone-900 group-hover:text-stone-700 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-xs text-stone-600 line-clamp-3 mt-2.5 leading-relaxed">
                    {article.subtitle || article.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-800">
                  <span>Read Full Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
