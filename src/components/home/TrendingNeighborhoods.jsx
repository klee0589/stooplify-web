import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp } from 'lucide-react';

const NEIGHBORHOODS = [
  { name: 'Williamsburg', slug: 'stoop-sales-williamsburg', emoji: '🎨', city: 'Brooklyn' },
  { name: 'Park Slope',   slug: 'stoop-sales-park-slope',  emoji: '🌳', city: 'Brooklyn' },
  { name: 'Astoria',      slug: 'stoop-sales-queens',      emoji: '🏙️', city: 'Queens'   },
  { name: 'Bushwick',     slug: 'garage-sales-brooklyn',   emoji: '🖌️', city: 'Brooklyn' },
  { name: 'Upper West Side', slug: 'garage-sales-manhattan', emoji: '🎭', city: 'Manhattan' },
  { name: 'Jersey City',  slug: 'stoop-sales-jersey-city', emoji: '🌉', city: 'NJ'       },
  { name: 'Astoria',      slug: 'garage-sales-queens',     emoji: '🏘️', city: 'Queens'   },
  { name: 'The Bronx',    slug: 'garage-sales-bronx',      emoji: '🏗️', city: 'Bronx'    },
];

// Deduplicate by slug
const HOODS = NEIGHBORHOODS.filter((h, i, arr) => arr.findIndex(x => x.slug === h.slug) === i);

export default function TrendingNeighborhoods() {
  const { data: saleCounts = {} } = useQuery({
    queryKey: ['neighborhoodCounts'],
    queryFn: async () => {
      const now = new Date();
      const sales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 200);
      const upcoming = sales.filter(s => s.date && new Date(`${s.date}T23:59:59`) >= now);

      // Count by city as proxy for borough
      const counts = {};
      upcoming.forEach(s => {
        const c = (s.city || '').toLowerCase();
        counts[c] = (counts[c] || 0) + 1;
      });
      return counts;
    },
    staleTime: 180000,
  });

  const getCityCount = (city) => {
    const key = city.toLowerCase();
    // fuzzy match
    const total = Object.entries(saleCounts)
      .filter(([k]) => k.includes(key) || key.includes(k))
      .reduce((sum, [, v]) => sum + v, 0);
    return total;
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[#FF6F61]" />
          <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Trending Neighborhoods This Weekend
          </h2>
        </div>

        {/* Horizontally scrollable strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
          {HOODS.map((hood, i) => {
            const count = getCityCount(hood.city);
            return (
              <motion.div
                key={hood.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/${hood.slug}`}
                  className="flex-shrink-0 flex flex-col items-center justify-between gap-2 px-5 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-[#14B8FF]/5 border-2 border-transparent hover:border-[#14B8FF] rounded-2xl transition-all group min-w-[130px] text-center"
                >
                  <span className="text-3xl">{hood.emoji}</span>
                  <div>
                    <p className="font-bold text-sm text-[#2E3A59] dark:text-white group-hover:text-[#14B8FF] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {hood.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{hood.city}</p>
                  </div>
                  {count > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 bg-[#14B8FF]/10 text-[#14B8FF] rounded-full">
                      {count} sale{count !== 1 ? 's' : ''}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}