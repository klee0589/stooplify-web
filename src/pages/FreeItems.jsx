import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Gift, Loader2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import SEO from '../components/SEO';
import FreeItemCard from '../components/free/FreeItemCard';

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Books', value: 'books' },
  { label: 'Toys', value: 'toys' },
  { label: 'General', value: 'general' },
];

const TAG_FILTERS = [
  { label: 'All Tags', value: 'all' },
  { label: '🛋️ Curbside', value: 'curbside' },
  { label: '📦 Moving', value: 'moving' },
  { label: '⚡ First Come', value: 'fcfs' },
];

export default function FreeItems() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['freeItems'],
    queryFn: async () => {
      const now = new Date().toISOString().split('T')[0];
      const all = await base44.entities.YardSale.filter({ status: 'approved', is_free_item: true }, '-created_date', 100);
      return all.filter(s => !s.date || s.date >= now);
    },
    staleTime: 60000,
  });

  const getDistanceMiles = (lat1, lng1, lat2, lng2) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const filtered = items
    .filter(item => {
      if (categoryFilter !== 'all') {
        const cats = item.categories || (item.category ? [item.category] : []);
        if (!cats.includes(categoryFilter)) return false;
      }
      if (tagFilter !== 'all') {
        if (!(item.free_item_tags || []).includes(tagFilter)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!userLocation) return 0;
      const distA = (a.latitude && a.longitude) ? getDistanceMiles(userLocation.lat, userLocation.lng, a.latitude, a.longitude) : 999;
      const distB = (b.latitude && b.longitude) ? getDistanceMiles(userLocation.lat, userLocation.lng, b.latitude, b.longitude) : 999;
      return distA - distB;
    });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Free Items Near You",
    "description": "Free stuff available for pickup near you — furniture, clothing, household items and more.",
    "numberOfItems": filtered.length,
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO
        title="Free Stuff Near You - Free Items for Pickup | Stooplify"
        description={`Browse ${filtered.length} free items available for pickup near you. Free furniture, clothing, household goods, and more from neighbors giving things away.`}
        keywords="free stuff near me, free items pickup, free furniture, free stuff nyc, free giveaway, curbside free, moving free stuff, declutter free items"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎁</span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Free Items Near You
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Neighbors giving things away — first come, first served.
          </p>
        </motion.div>

        {/* CTA to post */}
        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <Link
            to={createPageUrl('add-yard-sale') + '?type=free'}
            className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md"
          >
            <Gift className="w-4 h-4" />
            Give Away Items for Free
          </Link>
          <span className="text-sm text-gray-500">Moving? Decluttering? Give it away, not throw it away.</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setCategoryFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === f.value
                    ? 'bg-green-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {TAG_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setTagFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  tagFilter === f.value
                    ? 'bg-[#2E3A59] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2E3A59]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="font-semibold text-[#2E3A59] dark:text-white">{filtered.length}</span> free items available
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2">No free items yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Be the first to give something away in your neighborhood!</p>
            <Link
              to={createPageUrl('add-yard-sale') + '?type=free'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <Gift className="w-4 h-4" />
              Post Free Items
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <FreeItemCard item={item} userLocation={userLocation} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* SEO links */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Free Stuff by City
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Free Stuff NYC', url: '/free-stuff-nyc' },
              { label: 'Free Stuff Brooklyn', url: '/free-stuff-brooklyn' },
              { label: 'Free Stuff Queens', url: '/free-stuff-queens' },
              { label: 'Free Stuff Hoboken', url: '/free-stuff-hoboken' },
            ].map(link => (
              <Link key={link.url} to={link.url} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}