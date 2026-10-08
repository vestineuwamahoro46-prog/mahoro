import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Clock, Loader2, User } from 'lucide-react';
import { api } from '../lib/api.js';
import type { BlogPost } from '../types/research.js';

interface BlogPageProps {
  navigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    api.getBlogList()
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = category === 'ALL'
    ? posts
    : posts.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
          Academic Monograph & Analytical Essays
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 mt-1">
          Research Blog & Expert Perspectives
        </h1>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          In-depth commentary, methodological reflections, and forensic compliance essays published by lead investigators and institutional fellows.
        </p>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {['ALL', 'Compliance Practice', 'Fintech & Digital Assets', 'Judicial & Prosecution', 'Methodology & Risk'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'ALL' ? 'All Perspectives' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs">Loading research essays...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-400 transition-all cursor-pointer flex flex-col justify-between group shadow-2xs p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{post.readingTime}</span>
                  </span>
                </div>

                <h2 className="text-lg font-serif font-semibold text-stone-900 group-hover:text-stone-700 leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.content.replace(/#+/g, '').slice(0, 160)}...
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-medium">
                      {post.author.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-stone-900 block leading-tight">{post.author}</span>
                    <span className="text-[10px] text-stone-500">{post.authorRole || 'Contributor'}</span>
                  </div>
                </div>

                <span className="font-medium text-stone-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
