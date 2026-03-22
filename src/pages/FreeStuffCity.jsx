import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Gift, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import FreeItemCard from '../components/free/FreeItemCard';
import { createPageUrl } from '../utils';

const CITY_CONFIG = {
  'free-stuff-nyc': {
    city: 'NYC', fullName: 'New York City', states: ['NY', 'NJ'],
    cities: ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Manhattan', 'Staten Island'],
    description: 'Free stuff available for pickup in New York City. Furniture, clothing, household items and more — totally free from NYC neighbors.',
  },
  'free-stuff-brooklyn': {
    city: 'Brooklyn', fullName: 'Brooklyn, NY', states: ['NY'],
    cities: ['Brooklyn'],
    description: 'Free stuff in Brooklyn. Grab free furniture, clothing, books and household items from Brooklyn neighbors giving things away.',
  },
  'free-stuff-queens': {
    city: 'Queens', fullName: 'Queens, NY', states: ['NY'],
    cities: ['Queens', 'Astoria', 'Flushing', 'Jamaica'],
    description: 'Free items in Queens, NY. Neighbors in Astoria, Flushing, Jamaica and beyond giving away furniture, clothing and more.',
  },
  'free-stuff-hoboken': {
    city: 'Hoboken', fullName: 'Hoboken, NJ', states: ['NJ'],
    cities: ['Hoboken', 'Jersey City'],
    description: 'Free stuff in Hoboken and Jersey City, NJ. Find free furniture, household items and clothing from your neighbors.',
  },
};

export default function FreeStuffCity() {
  const slug = window.location.pathname.replace('/', '');
  const config = CITY_CONFIG[slug] || CITY_CONFIG['free-stuff-nyc'];
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
    queryKey: ['freeItemsCity', slug],
    queryFn: async () => {
      const now = new Date().toISOString().split('T')[0];
      const all = await base44.entities.YardSale.filter({ status: 'approved', is_free_item: true }, '-created_date', 100);
      return all.filter(s => {
        if (s.date && s.date < now) return false;
        const matchesCity = config.cities.some(c => (s.city || '').toLowerCase().includes(c.toLowerCase()));
        const matchesState = config.states.includes(s.state);
        return matchesCity || matchesState;
      });
    },
    staleTime: 60000,
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Free Stuff in ${config.fullName}`,
    "description": config.description,
    "numberOfItems": items.length,
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO
        title={`Free Stuff in ${config.fullName} Today | Stooplify`}
        description={config.description}
        keywords={`free stuff ${config.city}, free items ${config.city}, free furniture ${config.city}, free giveaway ${config.city}, curbside free ${config.city}`}
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Free Stuff in {config.fullName} Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">{config.description}</p>
        </motion.div>

        <div className="mb-6">
          <Link
            to="/add-yard-sale?type=free"
            className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md"
          >
            <Gift className="w-4 h-4" />
            Give Items Away for Free
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2">No free items in {config.city} yet</h3>
            <p className="text-gray-500 mb-4">Be the first to give something away!</p>
            <Link to="/add-yard-sale?type=free" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors">
              <Gift className="w-4 h-4" /> Post Free Items
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4"><span className="font-semibold text-[#2E3A59] dark:text-white">{items.length}</span> free items in {config.city}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <FreeItemCard item={item} userLocation={userLocation} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Other cities */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Free Stuff in Other Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CITY_CONFIG).filter(([k]) => k !== slug).map(([key, cfg]) => (
              <Link key={key} to={`/${key}`} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-400 transition-colors">
                Free Stuff in {cfg.city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}