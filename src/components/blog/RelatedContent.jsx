import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowRight, MapPin, BookOpen, PlusCircle } from 'lucide-react';

const CITY_LINKS = [
  { label: '🏙️ Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: '🌆 Queens Stoop Sales', url: '/stoop-sales-queens' },
  { label: '🗽 Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
  { label: '🌉 NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
  { label: '☀️ Los Angeles Garage Sales', url: '/garage-sales-los-angeles' },
  { label: '🌁 San Francisco Garage Sales', url: '/garage-sales-san-francisco' },
];

const GUIDE_LINKS = [
  { label: 'How to Find Yard Sales Near You', url: '/guides-find-yard-sales' },
  { label: 'How to Price Items for a Yard Sale', url: '/guides-pricing-yard-sale-items' },
  { label: 'Best Days & Times for a Yard Sale', url: '/guides-best-time-yard-sale' },
  { label: 'Permit Requirements in NYC', url: '/guides-permit-requirements-nyc' },
];

export default function RelatedContent({ currentSlug }) {
  const { data: posts = [] } = useQuery({
    queryKey: ['relatedPosts', currentSlug],
    queryFn: async () => {
      const all = await base44.entities.BlogPost.filter({ status: 'published' }, '-publish_date', 12);
      return all.filter(p => p.slug !== currentSlug).slice(0, 3);
    },
    staleTime: 300000,
  });

  return (
    <div className="mt-12 space-y-8">
      {/* Related Articles */}
      {posts.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <BookOpen className="w-5 h-5 text-[#14B8FF]" />
            Related Articles
          </h3>
          <div className="space-y-3">
            {posts.map(post => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-[#14B8FF] transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#14B8FF] transition-colors">{post.title}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#14B8FF] flex-shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cities */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <MapPin className="w-5 h-5 text-[#14B8FF]" />
          Popular Cities for Yard Sales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CITY_LINKS.slice(0, 3).map(city => (
            <Link
              key={city.url}
              to={city.url}
              className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] hover:border-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-all text-center"
            >
              {city.label}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {CITY_LINKS.slice(3).map(city => (
            <Link
              key={city.url}
              to={city.url}
              className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] hover:border-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-all text-center"
            >
              {city.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Related Guides */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          📚 Related Guides
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {GUIDE_LINKS.map(guide => (
            <Link
              key={guide.url}
              to={guide.url}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#14B8FF] hover:text-[#14B8FF] transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span className="text-[#14B8FF]">→</span>
              {guide.label}
            </Link>
          ))}
        </div>
      </div>

      {/* List Your Sale CTA */}
      <div className="p-6 bg-[#FF6F61]/5 rounded-2xl border border-[#FF6F61]/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Have a Sale Coming Up?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">List your yard sale for free and reach local buyers in your neighborhood.</p>
          </div>
          <Link
            to="/add-yard-sale"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-[#FF6F61] text-white rounded-xl font-semibold text-sm hover:bg-[#e85d50] transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            List Your Sale Free
          </Link>
        </div>
      </div>
    </div>
  );
}