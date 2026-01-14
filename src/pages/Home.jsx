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
      
      {/* From the Founder */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6 flex items-center justify-center gap-2">
            <span>👋</span> From the Founder
          </h3>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Hey, I'm Daniel, the founder of Stooplify.
            </p>
            
            <p>
              I was born in Korea and raised in Queens and Brooklyn. I've always loved the thrift, stoop, and garage sale scene. Growing up here, weekend walks meant discovering random yard sales, sidewalk finds, and hidden gems you'd never see online.
            </p>
            
            <p>
              Stooplify came from that simple idea: <strong>why should great local sales be invisible unless you happen to walk by at the right time?</strong>
            </p>
            
            <p>
              I wanted to build something that makes it easier for neighbors to share their sales and for others to find them—without spam, sketchy listings, or big platforms getting in the way. Just real people, real neighborhoods, and real finds.
            </p>
            
            <p>
              If you have questions, ideas, or just want to say hi, I'd genuinely love to hear from you.
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a 
                href="mailto:daniel@stooplify.com"
                className="inline-flex items-center gap-2 text-[#FF6F61] hover:underline font-semibold"
              >
                📩 daniel@stooplify.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}