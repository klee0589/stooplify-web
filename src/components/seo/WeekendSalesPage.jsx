import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { format, parseISO, addDays } from 'date-fns';
import { createPageUrl } from '@/utils';

function getThisWeekend() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  
  let start, end;
  if (day === 6) { // Saturday
    start = new Date(now); start.setHours(0,0,0,0);
    end = addDays(start, 1); end.setHours(23,59,59,999);
  } else if (day === 0) { // Sunday
    start = new Date(now); start.setHours(0,0,0,0);
    end = new Date(now); end.setHours(23,59,59,999);
  } else {
    // Weekday — next Saturday
    const daysUntilSat = 6 - day;
    start = addDays(now, daysUntilSat); start.setHours(0,0,0,0);
    end = addDays(start, 1); end.setHours(23,59,59,999);
  }
  return { start, end };
}

export default function WeekendSalesPage({ config }) {
  const navigate = useNavigate();
  const { title, metaTitle, metaDescription, keywords, h1, intro, cityFilter, neighborhoodFilter, canonicalUrl } = config;

  const { start: weekendStart, end: weekendEnd } = getThisWeekend();
  const weekendLabel = format(weekendStart, 'MMMM d') + (
    weekendStart.getDay() === weekendEnd.getDay() ? '' : `–${format(weekendEnd, 'd')}`
  );

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['weekendSales', canonicalUrl],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, 'date', 50);
      const now = new Date();
      return allSales.filter(sale => {
        const saleDate = parseISO(sale.date);
        const saleEnd = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
        
        // Must be this weekend
        const isWeekend = saleDate >= weekendStart && saleDate <= weekendEnd;
        if (!isWeekend || saleEnd < now) return false;
        
        // City/neighborhood filter
        if (cityFilter) {
          const haystack = [sale.city, sale.state, sale.general_location, sale.zip_code].join(' ').toLowerCase();
          const matchesCity = cityFilter.some(c => haystack.includes(c.toLowerCase()));
          if (!matchesCity) return false;
        }
        if (neighborhoodFilter) {
          const haystack = [sale.general_location, sale.city].join(' ').toLowerCase();
          const matchesNeighborhood = neighborhoodFilter.some(n => haystack.includes(n.toLowerCase()));
          if (!matchesNeighborhood) return false;
        }
        return true;
      });
    }
  });

  const dynamicMetaTitle = metaTitle.replace('{date}', weekendLabel);
  const dynamicH1 = h1.replace('{date}', weekendLabel);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": dynamicMetaTitle,
    "description": metaDescription,
    "url": canonicalUrl,
    "dateModified": new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title={dynamicMetaTitle}
        description={metaDescription}
        keywords={keywords}
        url={canonicalUrl}
        structuredData={structuredData}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#FF6F61] to-[#F5A623] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" /> Updated for {weekendLabel}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {dynamicH1}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">{intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(createPageUrl('YardSales'))} className="bg-white text-[#FF6F61] hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
                <Search className="w-5 h-5 mr-2" /> Browse All Sales
              </Button>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <PlusCircle className="w-5 h-5 mr-2" /> List Your Sale Free
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Live count */}
        {!isLoading && (
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {sales.length} sale{sales.length !== 1 ? 's' : ''} found this weekend
            </div>
            <span className="text-gray-400 text-sm">Updated live</span>
          </div>
        )}

        {/* Listings */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title} — {weekendLabel}
          </h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF6F61] border-t-transparent" />
            </div>
          ) : sales.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No sales listed yet for this weekend</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Check back closer to the weekend, or be the first to list!</p>
              <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-[#FF6F61] text-white hover:bg-[#e85d51]">
                List Your Sale Free
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sales.map((sale, i) => (
                <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-[#FF6F61] hover:shadow-lg transition-all group">
                    {sale.photos?.[0] && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img src={sale.photos[0]} alt={sale.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#FF6F61] transition-colors">{sale.title}</h3>
                      <ArrowRight className="w-4 h-4 text-[#FF6F61] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(parseISO(sale.date), 'EEE, MMM d')}</span>
                      {sale.start_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sale.start_time}</span>}
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{sale.general_location}</span>
                    </div>
                    {sale.categories && sale.categories.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {sale.categories.slice(0, 3).map(c => (
                          <Badge key={c} className="bg-orange-50 text-orange-600 text-xs border-0">{c}</Badge>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to={createPageUrl('YardSales')} className="inline-flex items-center gap-2 text-[#FF6F61] font-medium hover:underline">
              See all upcoming sales on the map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SEO content block */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How to Find the Best {title}
          </h2>
          <div className="prose prose-sm max-w-none dark:prose-invert text-gray-600 dark:text-gray-300 space-y-3">
            <p>
              Stooplify automatically surfaces all stoop sales, yard sales, and garage sales happening near you this weekend.
              Listings are posted by real sellers in your neighborhood — browse by map, filter by category, or enable
              smart alerts to get notified the moment a new sale goes live.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Arrive early — the best items sell in the first hour</li>
              <li>Bring cash and Venmo/CashApp for flexibility</li>
              <li>Use the map view on Stooplify to plan your route efficiently</li>
              <li>Check back Friday evening for fresh weekend listings</li>
            </ul>
            <p>
              Want to sell this weekend? <Link to={createPageUrl('AddYardSale')} className="text-[#FF6F61] hover:underline font-medium">List your sale for free on Stooplify</Link> — it takes under 5 minutes and reaches buyers in your neighborhood automatically.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Selling this weekend?
          </h3>
          <p className="text-white/90 mb-6">List your sale for free and reach local buyers who are actively looking</p>
          <Button onClick={() => navigate(createPageUrl('AddYardSale'))} className="bg-white text-[#FF6F61] hover:bg-gray-100 font-semibold">
            List Your Sale Free — It's Quick!
          </Button>
        </div>
      </div>
    </div>
  );
}