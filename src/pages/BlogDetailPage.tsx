import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Share2, Tag, Loader2, Check } from 'lucide-react';
import { api } from '../lib/api.js';
import type { BlogPost } from '../types/research.js';

interface BlogDetailPageProps {
  idOrSlug: string;
  navigate: (path: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ idOrSlug, navigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getBlogById(idOrSlug)
      .then((data) => setPost(data))
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
        <span className="text-xs">Loading essay...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-serif font-semibold text-stone-900">Essay Not Found</h2>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 text-xs font-medium bg-stone-100 rounded-md"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => navigate('/blog')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Blog Directory</span>
      </button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span className="text-stone-800 font-semibold">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-950 leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Box */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <div className="flex items-center gap-3">
            {post.authorImage ? (
              <img
                src={post.authorImage}
                alt={post.author}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-stone-300"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-stone-200 text-stone-700 font-serif font-bold flex items-center justify-center">
                {post.author.slice(0, 1)}
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-stone-900 block">{post.author}</span>
              <span className="text-xs text-stone-500">{post.authorRole || 'Compliance Scholar'}</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="rounded-2xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200 shadow-sm">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Essay Content */}
      <div className="max-w-2xl mx-auto py-4 space-y-6 text-stone-800 leading-relaxed text-base sm:text-lg">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-stone-950 pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 pt-6">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          return (
            <p key={idx} className={idx === 0 ? "first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 leading-relaxed" : "leading-relaxed"}>
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="max-w-2xl mx-auto pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Keywords:</span>
          {post.tags.map((t) => (
            <span key={t} className="text-xs text-stone-700 font-mono">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
