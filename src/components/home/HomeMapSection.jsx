import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { activeSaleQuery, localDateStr } from '@/lib/listingLifecycle';
import SaleMap from '../sales/SaleMap';
import SectionHeader from './SectionHeader';

export default function HomeMapSection() {
  const today = localDateStr();

  const { data: sales = [] } = useQuery({
    queryKey: ['homeMapSales', today],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter(activeSaleQuery({ status: 'approved' }), '-date', 200);
      return allSales.filter((sale) => sale.date && sale.date >= today);
    },
    staleTime: 120000,
  });

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Live map"
          title="See what's happening on your block"
          subtitle={
            sales.length > 0
              ? `${sales.length} upcoming sale${sales.length === 1 ? '' : 's'} pinned right now. Tap a pin to see the details.`
              : 'Every approved sale is pinned here as soon as it goes live.'
          }
          action={
            <Link to="/yard-sales" className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
              Open the full map <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-border shadow-card md:h-[520px]">
          <SaleMap sales={sales} />
        </div>
      </div>
    </section>
  );
}