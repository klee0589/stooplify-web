import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

const ui = {
  en: {
    backToBlog: 'Back to Blog',
    minRead: 'min read',
    by: 'By',
    share: 'Share',
    readyToFindDeal: 'Ready to Find Your Next Great Deal?',
    discoverDeals: 'Discover amazing yard sales and secondhand treasures in your neighborhood',
    browseSales: 'Browse Yard Sales',
    noPost: 'No post specified',
    postNotFound: 'Post not found',
    backBtn: 'Back to Blog',
    noSpanish: 'Spanish version coming soon.',
  },
  es: {
    backToBlog: 'Volver al Blog',
    minRead: 'min de lectura',
    by: 'Por',
    share: 'Compartir',
    readyToFindDeal: '¿Listo para Encontrar tu Próxima Gran Oferta?',
    discoverDeals: 'Descubre increíbles ventas de garaje y tesoros de segunda mano en tu vecindario',
    browseSales: 'Ver Ventas',
    noPost: 'No se especificó publicación',
    postNotFound: 'Publicación no encontrada',
    backBtn: 'Volver al Blog',
    noSpanish: 'Versión en español próximamente.',
  }
};

export default function BlogSlug() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract slug from the path: /blog/some-slug → "some-slug"
  const pathParts = location.pathname.split('/');
  const slug = pathParts[pathParts.length - 1] || null;

  const [language, setLanguage] = useState(() => localStorage.getItem('stooplify_lang') || 'en');
  const [postLang, setPostLang] = useState(() => localStorage.getItem('stooplify_lang') || 'en');

  useEffect(() => {
    const handleLangChange = (e) => {
      setLanguage(e.detail);
      setPostLang(e.detail);
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isSpanish = postLang === 'es';
  const t = ui[language] || ui.en;

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
    if (post) incrementViewMutation.mutate();
  }, [post?.id]);

  const handleShare = async () => {
    const shareUrl = `https://stooplify.com/blog/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: displayTitle, text: displayExcerpt, url: shareUrl });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert(isSpanish ? '¡Enlace copiado!' : 'Link copied to clipboard!');
    }
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t.noPost}</h1>
          <Button onClick={() => navigate(createPageUrl('Blog'))}>{t.backBtn}</Button>
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
          <h1 className="text-2xl font-bold mb-4">{t.postNotFound}</h1>
          <Button onClick={() => navigate(createPageUrl('Blog'))}>{t.backBtn}</Button>
        </div>
      </div>
    );
  }

  const displayTitle = isSpanish ? (post.title_es || post.title) : post.title;
  const displayExcerpt = isSpanish ? (post.excerpt_es || post.excerpt) : post.excerpt;
  const displayContent = isSpanish ? (post.content_es || post.content) : post.content;
  const hasSpanish = !!(post.title_es && post.content_es);
  const hasTranslation = hasSpanish;
  const canonicalUrl = `https://stooplify.com/blog/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": displayTitle,
    "description": (isSpanish ? post.meta_description_es : post.meta_description) || post.excerpt,
    "image": post.featured_image_url,
    "datePublished": post.publish_date,
    "dateModified": post.updated_date || post.publish_date,
    "inLanguage": isSpanish ? "es" : "en",
    "author": {
      "@type": "Person",
      "name": post.author_name || "Stooplify Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stooplify",
      "logo": { "@type": "ImageObject", "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/ada49740a_Stooplify-01.png" }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": post.meta_keywords?.join(', ')
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={`${displayTitle} | ${isSpanish ? 'Blog de Stooplify' : 'Stooplify Blog'}`}
        description={(isSpanish ? post.meta_description_es : post.meta_description) || post.excerpt}
        keywords={post.meta_keywords?.join(', ')}
        image={post.featured_image_url}
        url={canonicalUrl}
        type="article"
        structuredData={structuredData}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Blog'))}
            className="gap-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToBlog}
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
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
            {displayTitle}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {displayExcerpt}
          </p>

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
                    {post.reading_time_minutes} {t.minRead}
                  </span>
                </>
              )}
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{t.by} {post.author_name || 'Stooplify Team'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2 hover:bg-[#14B8FF] hover:text-white hover:border-[#14B8FF]"
            >
              <Share2 className="w-4 h-4" />
              {t.share}
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
            <img src={post.featured_image_url} alt={post.title} className="w-full h-auto" />
          </motion.div>
        )}

        {/* No Spanish version notice */}
        {isSpanish && !hasSpanish && (
          <div className="mb-8 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
            {t.noSpanish}
          </div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-700 dark:text-gray-300"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-20 mb-8 font-['Poppins']">{children}</h1>,
              h2: ({ children }) => <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-20 mb-8 font-['Poppins']">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-16 mb-6 font-['Poppins']">{children}</h3>,
              h4: ({ children }) => <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-12 mb-4 font-['Poppins']">{children}</h4>,
              p: ({ children }) => <p className="text-lg leading-relaxed mb-8 text-gray-700 dark:text-gray-300">{children}</p>,
              a: ({ href, children }) => <a href={href} className="text-[#14B8FF] font-medium hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
              strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-8 my-10 space-y-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-8 my-10 space-y-3">{children}</ol>,
              li: ({ children }) => <li className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{children}</li>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-[#14B8FF] bg-gray-50 dark:bg-gray-800 py-6 px-8 my-12 rounded-r-lg">{children}</blockquote>,
              code: ({ inline, children }) => (
                inline
                  ? <code className="text-[#14B8FF] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm">{children}</code>
                  : <code className="block text-[#14B8FF] bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm my-8 overflow-x-auto">{children}</code>
              ),
              img: ({ src, alt }) => <img src={src} alt={alt} className="w-full h-auto rounded-lg my-12" />,
              hr: () => <hr className="my-16 border-gray-200 dark:border-gray-700" />,
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 p-8 bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] rounded-2xl text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t.readyToFindDeal}
          </h3>
          <p className="mb-6 text-white/90">
            {t.discoverDeals}
          </p>
          <Button
            onClick={() => navigate(createPageUrl('YardSales'))}
            className="bg-white text-[#14B8FF] hover:bg-gray-100"
          >
            {t.browseSales}
          </Button>
        </motion.div>
      </article>
    </div>
  );
}