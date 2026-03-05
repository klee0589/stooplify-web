import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { format, parseISO, isToday, isTomorrow, nextSaturday, nextSunday, isSameDay } from 'date-fns';
import { createPageUrl } from '@/utils';

// dateFilter: 'today' | 'tomorrow' | 'saturday' | 'sunday'
export default function DateLandingPage({ config }) {
  const navigate = useNavigate();
  const { dateFilter, locationFilter, title, metaTitle, metaDescription, keywords, h1, intro, canonicalUrl } = config;

  const targetDate = React.useMemo(() => {
    const now = new Date();
    if (dateFilter === 'today') return now;
    if (dateFilter === 'tomorrow') { const d = new Date(now); d.setDate(d.getDate() + 1); return d; }
    if (dateFilter === 'saturday') return nextSaturday(now);
    if (dateFilter === 'sunday') return nextSunday(now);
    return now;
  }, [dateFilter]);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['dateLandingSales', dateFilter, locationFilter],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 100);
      return allSales.filter((sale) => {
        if (!sale.date) return false;
        const saleDate = parseISO(sale.date);
        const matchesDate = isSameDay(saleDate, targetDate);
        if (!locationFilter) return matchesDate;
        const loc = (sale.city || sale.state || sale.general_location || '').toLowerCase();
        const matchesLocation = locationFilter.some(l => loc.includes(l.toLowerCase()));
        return matchesDate && matchesLocation;
      });
    }
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": metaTitle,
    "description": metaDescription,
    "url": canonicalUrl
  };

  const dateLabel = format(targetDate, 'EEEE, MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO title={metaTitle} description={metaDescription} keywords={keywords} url={canonicalUrl} structuredData={structuredData} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a2842] to-[#14B8FF] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" /> {dateLabel}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{h1}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">{intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(createPageUrl('YardSales'))} className="bg-white text-[#1a2842] hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
                Browse All Sales
              </Button>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <PlusCircle className="w-5 h-5 mr-2" /> List Your Sale Free
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {sales.length > 0 ? `${sales.length} Sale${sales.length !== 1 ? 's' : ''} — ${dateLabel}` : `Sales for ${dateLabel}`}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Live listings updated in real-time</p>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14B8FF] border-t-transparent" />
            </div>
          ) : sales.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No sales listed for {dateLabel} yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Be the first to list a sale for this date!</p>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-[#14B8FF] text-white">
                List Your Sale Free
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sales.map((sale, i) => (
                <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-[#14B8FF] hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#14B8FF] transition-colors">{sale.title}</h3>
                      <ArrowRight className="w-4 h-4 text-[#14B8FF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      {sale.start_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sale.start_time}</span>}
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{sale.general_location}</span>
                      <span className="text-xs">{sale.city}, {sale.state}</span>
                    </div>
                    {sale.categories?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {sale.categories.slice(0, 3).map(c => <Badge key={c} className="bg-[#14B8FF]/10 text-[#14B8FF] text-xs">{c}</Badge>)}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to={createPageUrl('YardSales')} className="inline-flex items-center gap-2 text-[#14B8FF] font-medium hover:underline">
              View all sales on the map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <div className="bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Selling {dateLabel.split(',')[0]}?</h3>
          <p className="text-white/90 mb-6">List for free and reach thousands of local buyers</p>
          <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-white text-[#14B8FF] hover:bg-gray-100 font-semibold">
            List Your Sale Free
          </Button>
        </div>
      </div>
    </div>
  );
}