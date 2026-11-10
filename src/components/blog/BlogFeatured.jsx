import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogFeatured({ post, isSpanish, label, readLabel }) {
  const title = isSpanish ? post.title_es || post.title : post.title;
  const excerpt = isSpanish ? post.excerpt_es || post.excerpt : post.excerpt;
  return (
    <Link to={`/blog/${post.slug}`} className="group relative block h-full min-h-[420px] rounded-3xl overflow-hidden shadow-card-hover bg-foreground">
      {post.featured_image_url && (
        <img src={post.featured_image_url} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
        <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-accent-warm text-accent-warm-foreground text-xs font-bold uppercase tracking-wide mb-4">
          <Sparkles className="w-3.5 h-3.5" /> {label}
        </span>
        <h2 className="font-heading text-2xl md:text-4xl font-bold leading-tight mb-3 max-w-2xl">{title}</h2>
        <p className="text-white/80 line-clamp-2 max-w-xl mb-5">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/70">{format(new Date(post.publish_date), 'MMM d, yyyy')}</span>
          <span className="inline-flex items-center gap-1.5 font-semibold group-hover:gap-3 transition-all">
            {readLabel} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}