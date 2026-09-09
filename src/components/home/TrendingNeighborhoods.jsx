import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const NEIGHBORHOODS = [
  { name: 'Williamsburg', slug: 'stoop-sales-williamsburg', city: 'Brooklyn' },
  { name: 'Park Slope',   slug: 'stoop-sales-park-slope',  city: 'Brooklyn' },
  { name: 'Astoria',      slug: 'stoop-sales-queens',      city: 'Queens'   },
  { name: 'Bushwick',     slug: 'garage-sales-brooklyn',   city: 'Brooklyn' },
  { name: 'Upper West Side', slug: 'garage-sales-manhattan', city: 'Manhattan' },
  { name: 'Jersey City',  slug: 'stoop-sales-jersey-city', city: 'NJ'       },
  { name: 'Astoria',      slug: 'garage-sales-queens',     city: 'Queens'   },
  { name: 'The Bronx',    slug: 'garage-sales-bronx',      city: 'Bronx'    },
];

const HOODS = NEIGHBORHOODS.filter((h, i, arr) => arr.findIndex(x => x.slug === h.slug) === i);

export default function TrendingNeighborhoods() {
  const { data: saleCounts = {} } = useQuery({
    queryKey: ['neighborhoodCounts'],
    queryFn: async () => {
      const now = new Date();
      const sales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 200);
      const upcoming = sales.filter(s => s.date && new Date(`${s.date}T23:59:59`) >= now);
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
    return Object.entries(saleCounts)
      .filter(([k]) => k.includes(key) || key.includes(k))
      .reduce((sum, [, v]) => sum + v, 0);
  };

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-accent-warm" />
          <h2 className="font-heading text-xl font-semibold text-foreground">Trending neighborhoods this weekend</h2>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 sm:overflow-visible">
          {HOODS.map((hood, i) => {
            const count = getCityCount(hood.city);
            return (
              <motion.div
                key={hood.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 w-[200px] sm:w-auto"
              >
                <Link
                  to={`/${hood.slug}`}
                  className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{hood.city}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <p className="font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">{hood.name}</p>
                    {count > 0 && (
                      <span className="rounded-full bg-accent-warm/10 px-2 py-0.5 text-xs font-semibold text-accent-warm whitespace-nowrap">
                        {count} sale{count !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}