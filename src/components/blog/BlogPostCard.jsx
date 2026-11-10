import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPostCard({ post, isSpanish, minRead }) {
  const title = isSpanish ? post.title_es || post.title : post.title;
  const excerpt = isSpanish ? post.excerpt_es || post.excerpt : post.excerpt;
  return (
    <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-primary/10">
        {post.featured_image_url ? (
          <img src={post.featured_image_url} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-primary/50" /></div>
        )}
        {post.tags?.[0] && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold text-primary">{post.tags[0]}</span>
        )}
        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-accent-warm text-accent-warm-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{format(new Date(post.publish_date), 'MMM d, yyyy')}</span>
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.reading_time_minutes} {minRead}</span>
          )}
        </div>
      </div>
    </Link>
  );
}