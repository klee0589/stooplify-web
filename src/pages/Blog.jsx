import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { format } from 'date-fns';

const blogTranslations = {
  en: {
    title: 'Stooplify Blog',
    subtitle: 'Expert tips, guides, and stories about yard sales, secondhand shopping, and finding community treasures',
    searchPlaceholder: 'Search articles...',
    noResults: 'No articles found matching your search.',
    noPosts: 'No blog posts yet. Check back soon!',
    minRead: 'min read',
    seoTitle: 'Blog - Yard Sale Tips, Guides & Stories | Stooplify',
    seoDesc: 'Discover expert tips, guides, and stories about yard sales, garage sales, and secondhand shopping.',
  },
  es: {
    title: 'Blog de Stooplify',
    subtitle: 'Consejos de expertos, guías e historias sobre ventas de garaje, compras de segunda mano y tesoros comunitarios',
    searchPlaceholder: 'Buscar artículos...',
    noResults: 'No se encontraron artículos.',
    noPosts: 'Aún no hay publicaciones. ¡Vuelve pronto!',
    minRead: 'min de lectura',
    seoTitle: 'Blog - Consejos y Guías sobre Ventas de Garaje | Stooplify',
    seoDesc: 'Descubre consejos de expertos, guías e historias sobre ventas de garaje y compras de segunda mano.',
  }
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('stooplify_lang') || 'en');

  useEffect(() => {
    const handleLangChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = blogTranslations[language] || blogTranslations.en;
  const isSpanish = language === 'es';

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      return await base44.entities.BlogPost.filter({ status: 'published' }, '-publish_date');
    }
  });

  const filteredPosts = posts.filter(post => {
    const title = isSpanish ? (post.title_es || post.title) : post.title;
    const excerpt = isSpanish ? (post.excerpt_es || post.excerpt) : post.excerpt;
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t.title,
    "description": t.subtitle,
    "url": typeof window !== 'undefined' ? window.location.href : 'https://stooplify.com/blog',
    "inLanguage": isSpanish ? "es" : "en",
    "blogPost": posts.slice(0, 10).map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.meta_description || post.excerpt,
      "datePublished": post.publish_date,
      "author": { "@type": "Person", "name": post.author_name || "Stooplify Team" },
      "url": `https://stooplify.com/blog/${post.slug}`
    }))
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={t.seoTitle}
        description={t.seoDesc}
        keywords={isSpanish
          ? "blog ventas de garaje, consejos venta en stoop brooklyn, compras segunda mano"
          : "yard sale blog, garage sale tips, brooklyn stoop sale, secondhand shopping"}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#14B8FF] to-[#0da3e6] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t.title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              {t.subtitle}
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg bg-white"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14B8FF] border-t-transparent mx-auto" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm ? t.noResults : t.noPosts}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={createPageUrl('BlogPost') + `?slug=${post.slug}&lang=${language}`}
                  className="group block h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#14B8FF] hover:shadow-xl transition-all duration-300"
                >
                  {post.featured_image_url && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} className="bg-[#14B8FF]/10 text-[#14B8FF] hover:bg-[#14B8FF]/20 text-xs font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#14B8FF] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {isSpanish ? (post.title_es || post.title) : post.title}
                    </h2>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                      {isSpanish ? (post.excerpt_es || post.excerpt) : post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(new Date(post.publish_date), 'MMM d')}
                        </span>
                        {post.reading_time_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.reading_time_minutes} {t.minRead}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#14B8FF] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}