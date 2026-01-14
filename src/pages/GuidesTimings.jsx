import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Home, ChevronRight } from 'lucide-react';

export default function GuidesTimings() {
  useEffect(() => {
    document.title = 'Best Days & Times to Host a Yard Sale in NYC | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'When should you host a yard sale in New York City? Learn the best days, times, and seasons for maximum turnout in Brooklyn, Queens, and NYC neighborhoods.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Days & Times to Host a Yard Sale",
      "description": "Timing tips for hosting successful yard sales in NYC",
      "image": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
      "author": {"@type": "Organization", "name": "Stooplify"},
      "publisher": {"@type": "Organization", "name": "Stooplify"},
      "datePublished": "2026-01-14"
    });
    document.head.appendChild(script);
    
    return () => document.head.removeChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={createPageUrl('Home')} className="hover:text-[#FF6F61] flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={createPageUrl('Guides')} className="hover:text-[#FF6F61]">Guides</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2E3A59] font-medium">Best Times</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=400&fit=crop" 
            alt="Weekend morning yard sale"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Best Days & Times to Host a Yard Sale
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Timing can make or break a yard sale. Even great items won't sell if no one shows up.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Best Days of the Week
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li><strong>Saturday is the best day</strong></li>
              <li>Sunday works, but mornings are key</li>
              <li>Weekdays are usually slower unless in busy areas</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Best Times
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li><strong>Start early: 8:00–9:00 AM</strong></li>
              <li>Most buyers come before noon</li>
              <li>End around 2:00–3:00 PM</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Seasonal Tips
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Spring and summer get the most traffic</li>
              <li>Avoid rainy days if possible</li>
              <li>Holiday weekends can be hit or miss</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              NYC Neighborhood Tip
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              If you're in Queens, Brooklyn, or dense areas, buyers often walk — so visibility and timing matter even more.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Posting your sale ahead of time on Stooplify lets people plan their visit before the weekend.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('AddYardSale')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 Schedule your yard sale on Stooplify
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}