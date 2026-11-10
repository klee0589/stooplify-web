import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BlogCTABanner from '../components/BlogCTABanner';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SEO from '@/components/SEO';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogFeatured from '@/components/blog/BlogFeatured';
import TrendingPosts from '@/components/blog/TrendingPosts';
import TopicChips, { TOPICS } from '@/components/blog/TopicChips';

const POSTS_PER_PAGE = 12;

const blogTranslations = {
  en: {
    eyebrow: 'The Stooplify Blog',
    title: 'Stories, tips & treasure-hunting guides',
    subtitle: 'Everything you need to score great finds and run a sale your whole block will talk about.',
    searchPlaceholder: 'Search articles...',
    noResults: 'No articles found matching your search.',
    noPosts: 'No blog posts yet. Check back soon!',
    minRead: 'min read',
    seoTitle: 'Blog - Yard Sale Tips, Guides & Stories | Stooplify',
    seoDesc: 'Discover expert tips, guides, and stories about yard sales, garage sales, and secondhand shopping.',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    latest: 'Latest story',
    readNow: 'Read now',
    trending: 'Trending now',
    trendingSub: 'Most-read from Google search this month',
    allPosts: 'Fresh reads'
  },
  es: {
    eyebrow: 'El Blog de Stooplify',
    title: 'Historias, consejos y guías para cazar tesoros',
    subtitle: 'Todo lo que necesitas para encontrar joyas y organizar una venta de la que hable todo el barrio.',
    searchPlaceholder: 'Buscar artículos...',
    noResults: 'No se encontraron artículos.',
    noPosts: 'Aún no hay publicaciones. ¡Vuelve pronto!',
    minRead: 'min de lectura',
    seoTitle: 'Blog - Consejos y Guías sobre Ventas de Garaje | Stooplify',
    seoDesc: 'Descubre consejos de expertos, guías e historias sobre ventas de garaje y compras de segunda mano.',
    previous: 'Anterior',
    next: 'Siguiente',
    page: 'Página',
    latest: 'Lo más nuevo',
    readNow: 'Leer ahora',
    trending: 'En tendencia',
    trendingSub: 'Lo más leído desde Google este mes',
    allPosts: 'Lecturas recientes'
  }
};

export default function Blog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [topic, setTopic] = useState('All');
  const [language, setLanguage] = useState(() => localStorage.getItem('stooplify_lang') || 'en');

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
  const topicTags = TOPICS.find((x) => x.label === topic)?.tags;

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blogPosts', currentPage, searchTerm, sortOrder, topic],
    queryFn: async () => {
      const query = { status: 'published', ...(topicTags ? { tags: { $in: topicTags } } : {}) };
      if (searchTerm) {
        const rx = { $regex: searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
        return await base44.entities.BlogPost.filter({ ...query, $or: [{ title: rx }, { excerpt: rx }, { title_es: rx }] }, sortParam, 50);
      }
      return await base44.entities.BlogPost.filter(query, sortParam, POSTS_PER_PAGE + 1, offset);
    },
    keepPreviousData: true
  });

  const hasMorePosts = !searchTerm && posts.length > POSTS_PER_PAGE;
  const displayedPosts = searchTerm ? posts : posts.slice(0, POSTS_PER_PAGE);
  const showSpotlight = currentPage === 1 && !searchTerm && topic === 'All' && sortOrder === 'newest';
  const featured = showSpotlight ? displayedPosts[0] : null;
  const gridPosts = featured ? displayedPosts.slice(1) : displayedPosts;

  const canonicalUrl = currentPage === 1 ? 'https://stooplify.com/blog' : `https://stooplify.com/blog?page=${currentPage}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": t.eyebrow,
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
    navigate(`/blog${page === 1 ? '' : `?page=${page}`}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 2); i <= currentPage + (hasMorePosts ? 2 : 0); i++) pageNumbers.push(i);

  const seoTitle = currentPage > 1 ? `${t.seoTitle} - ${t.page} ${currentPage}` : t.seoTitle;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={t.seoDesc}
        keywords={isSpanish
          ? "blog ventas de garaje, consejos venta en stoop brooklyn, compras segunda mano"
          : "yard sale blog, garage sale tips, brooklyn stoop sale, secondhand shopping"}
        structuredData={structuredData}
        url={canonicalUrl}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-warm/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-foreground/15 text-xs font-bold uppercase tracking-widest mb-5">{t.eyebrow}</span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold leading-[1.05] mb-5">{t.title}</h1>
            <p className="text-lg text-primary-foreground/85 mb-8 max-w-2xl">{t.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); if (currentPage !== 1) goToPage(1); }}
                  className="h-12 pl-12 rounded-full bg-card text-foreground border-0 shadow-glass"
                />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); goToPage(1); }}
                className="h-12 px-4 rounded-full bg-card text-foreground text-sm font-semibold border-0 shadow-glass cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Spotlight: latest + trending */}
        {showSpotlight && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {featured && <BlogFeatured post={featured} isSpanish={isSpanish} label={t.latest} readLabel={t.readNow} />}
            </div>
            <TrendingPosts isSpanish={isSpanish} title={t.trending} subtitle={t.trendingSub} />
          </div>
        )}

        <BlogCTABanner />

        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t.allPosts}</h2>
            <TopicChips active={topic} onChange={(label) => { setTopic(label); if (currentPage !== 1) goToPage(1); }} />
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : displayedPosts.length === 0 ? (
            <p className="text-center py-20 text-muted-foreground text-lg">{searchTerm ? t.noResults : t.noPosts}</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post, index) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                  <BlogPostCard post={post} isSpanish={isSpanish} minRead={t.minRead} />
                </motion.article>
              ))}
            </div>
          )}

          {!searchTerm && (currentPage > 1 || hasMorePosts) && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />{t.previous}
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                    n === currentPage ? 'bg-primary text-primary-foreground shadow-md' : 'border border-border text-foreground hover:bg-muted'
                  }`}
                  aria-label={`${t.page} ${n}`}
                  aria-current={n === currentPage ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMorePosts}
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                {t.next}<ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}