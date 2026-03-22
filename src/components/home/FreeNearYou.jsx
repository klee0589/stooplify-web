import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import FreeItemCard from '../free/FreeItemCard';

export default function FreeNearYou({ userLocation }) {
  const { data: items = [] } = useQuery({
    queryKey: ['freeItemsHome'],
    queryFn: async () => {
      const now = new Date().toISOString().split('T')[0];
      const all = await base44.entities.YardSale.filter({ status: 'approved', is_free_item: true }, '-created_date', 20);
      return all.filter(s => !s.date || s.date >= now).slice(0, 6);
    },
    staleTime: 120000,
  });

  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Free Near You
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Neighbors giving things away — totally free</p>
            </div>
          </div>
          <Link
            to="/free-items"
            className="hidden sm:flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold hover:underline text-sm"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <FreeItemCard item={item} userLocation={userLocation} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <Link
            to="/free-items"
            className="sm:hidden flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-semibold hover:underline text-sm"
          >
            View all free items <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/add-yard-sale?type=free"
            className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-md text-sm"
          >
            <Gift className="w-4 h-4" />
            Give Away Items for Free
          </Link>
        </div>
      </div>
    </section>
  );
}