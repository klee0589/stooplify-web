import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

export default function BlogPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ slug, status: 'published' });
      if (posts.length === 0) throw new Error('Post not found');
      return posts[0];
    },
    enabled: !!slug
  });

  const incrementViewMutation = useMutation({
    mutationFn: async () => {
      if (!post) return;
      await base44.entities.BlogPost.update(post.id, {
        view_count: (post.view_count || 0) + 1
      });
    }
  });

  useEffect(() => {
    if (post) {
      incrementViewMutation.mutate();
    }
  }, [post?.id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No post specified</h1>
          <Button onClick={() => navigate(createPageUrl('Blog'))}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14B8FF] border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button onClick={() => navigate(createPageUrl('Blog'))}>
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.featured_image_url,
    "datePublished": post.publish_date,
    "dateModified": post.updated_date || post.publish_date,
    "author": {
      "@type": "Person",
      "name": post.author_name || "Stooplify Team",
      "email": post.author_email
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stooplify",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stooplify.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? window.location.href : ''
    },
    "keywords": post.meta_keywords?.join(', ')
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={`${post.title} | Stooplify Blog`}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords?.join(', ')}
        image={post.featured_image_url}
        type="article"
        structuredData={structuredData}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Blog'))}
            className="gap-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} className="bg-[#14B8FF]/10 text-[#14B8FF] hover:bg-[#14B8FF]/20 font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.publish_date), 'MMMM d, yyyy')}
              </span>
              {post.reading_time_minutes && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.reading_time_minutes} min read
                  </span>
                </>
              )}
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>
                By {post.author_name || 'Stooplify Team'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 hover:bg-[#14B8FF] hover:text-white hover:border-[#14B8FF]"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </motion.header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-['Poppins'] prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4
            prose-h4:mt-8 prose-h4:mb-3
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-[#14B8FF] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-ul:my-8 prose-ol:my-8
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-[#14B8FF] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
            prose-code:text-[#14B8FF] prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
            prose-img:my-10 prose-img:rounded-lg"
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-8 bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] rounded-2xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Find Your Next Great Deal?
          </h3>
          <p className="mb-6 text-white/90">
            Discover amazing yard sales and secondhand treasures in your neighborhood
          </p>
          <Button
            onClick={() => navigate(createPageUrl('YardSales'))}
            className="bg-white text-[#14B8FF] hover:bg-gray-100"
          >
            Browse Yard Sales
          </Button>
        </motion.div>
      </article>
    </div>
  );
}