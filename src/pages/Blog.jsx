import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { format } from 'date-fns';

const POSTS_PER_PAGE = 10;

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
    previous: 'Previous',
    next: 'Next',
    page: 'Page'
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
    previous: 'Anterior',
    next: 'Siguiente',
    page: 'Página'
  }
};

export default function Blog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [language, setLanguage] = useState(() => localStorage.getItem('stooplify_lang') || 'en');

  // Read page from URL query param
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = Math.max(1, parseInt(urlParams.get('page') || '1', 10));

  useEffect(() => {
    const handleLangChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = blogTranslations[language] || blogTranslations.en;
  const isSpanish = language === 'es';

  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const sortParam = sortOrder === 'newest' ? '-publish_date' : sortOrder === 'oldest' ? 'publish_date' : 'title';

  // Fetch current page of posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts', currentPage, searchTerm, sortOrder],
    queryFn: async () => {
      if (searchTerm) {
        return await base44.entities.BlogPost.filter({ status: 'published' }, sortParam);
      }
      return await base44.entities.BlogPost.filter({ status: 'published' }, sortParam, POSTS_PER_PAGE + 1, offset);
    },
    keepPreviousData: true
  });

  // Fetch next page to know if there are more posts
  const hasMorePosts = !searchTerm && posts.length > POSTS_PER_PAGE;
  const displayedPosts = searchTerm
    ? posts.filter((post) => {
        const title = isSpanish ? post.title_es || post.title : post.title;
        const excerpt = isSpanish ? post.excerpt_es || post.excerpt : post.excerpt;
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
    : posts.slice(0, POSTS_PER_PAGE);

  const canonicalUrl = currentPage === 1
    ? 'https://stooplify.com/blog'
    : `https://stooplify.com/blog?page=${currentPage}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t.title,
    "description": t.subtitle,
    "url": canonicalUrl,
    "inLanguage": isSpanish ? "es" : "en",
    "blogPost": displayedPosts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.meta_description || post.excerpt,
      "datePublished": post.publish_date,
      "author": { "@type": "Person", "name": post.author_name || "Stooplify Team" },
      "url": `https://stooplify.com/blog/${post.slug}`
    }))
  };

  const goToPage = (page) => {
    const params = page === 1 ? '' : `?page=${page}`;
    navigate(`/blog${params}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const range = 2;
    for (let i = Math.max(1, currentPage - range); i <= currentPage + range; i++) {
      pages.push(i);
    }
    return pages;
  };

  const seoTitle = currentPage > 1
    ? `${t.seoTitle} - ${t.page} ${currentPage}`
    : t.seoTitle;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={seoTitle}
        description={t.seoDesc}
        keywords={isSpanish
          ? "blog ventas de garaje, consejos venta en stoop brooklyn, compras segunda mano"
          : "yard sale blog, garage sale tips, brooklyn stoop sale, secondhand shopping"}
        structuredData={structuredData}
        url={canonicalUrl}
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

            {/* Search + Sort */}
            <div className="max-w-xl mx-auto mb-6 flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (currentPage !== 1) goToPage(1);
                  }}
                  className="bg-white text-slate-950 pl-4 px-3 py-6 text-lg rounded-md flex h-9 w-full border border-input shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); goToPage(1); }}
                className="bg-white text-slate-800 text-sm font-medium rounded-md border border-input shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#14B8FF] cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#14B8FF] border-t-transparent mx-auto" />
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchTerm ? t.noResults : t.noPosts}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#14B8FF] hover:shadow-xl transition-all duration-300"
                  >
                    {post.featured_image_url && (
                      <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
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
                        {isSpanish ? post.title_es || post.title : post.title}
                      </h2>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                        {isSpanish ? post.excerpt_es || post.excerpt : post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(post.publish_date), 'MMM d, yyyy')}
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

            {/* Pagination — only show when not searching */}
            {!searchTerm && (currentPage > 1 || hasMorePosts) && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* Previous */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.previous}
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                      pageNum === currentPage
                        ? 'bg-[#14B8FF] text-white shadow-md'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    aria-label={`${t.page} ${pageNum}`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={!hasMorePosts}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  {t.next}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}