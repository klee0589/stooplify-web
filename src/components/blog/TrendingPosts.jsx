import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function TrendingPosts({ isSpanish, title, subtitle }) {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['trendingBlogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ status: 'published', trend_score: { $gt: 0 } }, '-trend_score', 5),
    staleTime: 10 * 60 * 1000,
  });

  if (!isLoading && posts.length === 0) return null;

  return (
    <aside className="h-full bg-card rounded-3xl border border-border shadow-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-full bg-accent-warm/15 flex items-center justify-center"><Flame className="w-4 h-4 text-accent-warm" /></span>
        <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-5">{subtitle}</p>
      <ol className="space-y-4">
        {isLoading
          ? [0, 1, 2, 3, 4].map((i) => <li key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)
          : posts.map((post, i) => (
              <li key={post.id}>
                <Link to={`/blog/${post.slug}`} className="group flex items-center gap-4">
                  <span className="font-heading text-3xl font-bold text-primary/30 group-hover:text-accent-warm transition-colors w-8 shrink-0">{i + 1}</span>
                  {post.featured_image_url && (
                    <img src={post.featured_image_url} alt="" loading="lazy" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {isSpanish ? post.title_es || post.title : post.title}
                  </span>
                </Link>
              </li>
            ))}
      </ol>
    </aside>
  );
}