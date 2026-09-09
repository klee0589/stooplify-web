import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import FreeItemCard from '../free/FreeItemCard';
import SectionHeader from './SectionHeader';

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
    <section className="py-16 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Free near you"
          title="Neighbors giving things away"
          subtitle="Totally free — first come, first served."
          action={
            <Link to="/free-items" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <FreeItemCard item={item} userLocation={userLocation} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <Link to="/free-items" className="sm:hidden inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary">
            View all free items <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/add-yard-sale?type=free"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-warm px-5 text-sm font-heading font-semibold text-accent-warm-foreground shadow-sm hover:shadow-md hover:bg-accent-warm/90 transition-all"
          >
            <Gift className="h-4 w-4" />
            Give away items for free
          </Link>
        </div>
      </div>
    </section>
  );
}