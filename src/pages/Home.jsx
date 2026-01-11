import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedSales from '../components/home/FeaturedSales';
import CTASection from '../components/home/CTASection';

export default function Home() {
  const { data: sales = [] } = useQuery({
    queryKey: ['featuredSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-created_date', 6);
      return allSales;
    },
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <FeaturedSales sales={sales} />
      <CTASection />
    </div>
  );
}