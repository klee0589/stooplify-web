import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Home, ChevronRight } from 'lucide-react';

export default function GuidesFindSales() {
  useEffect(() => {
    document.title = 'Where to Find Yard Sales Near Me This Weekend | Stooplify NYC';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Find yard sales near you in NYC this weekend. Browse local sales in Brooklyn, Queens, Manhattan on a map. Discover estate sales and garage sales near me.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Where to Find Yard Sales Near You This Weekend",
      "description": "How to discover local yard sales happening near you",
      "image": "https://images.unsplash.com/photo-1524661135-423995f22d0b",
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
          <span className="text-[#2E3A59] font-medium">Find Sales</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=400&fit=crop" 
            alt="Browsing and discovering local sales"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Where to Find Yard Sales Near You This Weekend
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Finding yard sales shouldn't feel like a scavenger hunt.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Why They're Hard to Find
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Facebook posts get buried</li>
              <li>Craigslist is cluttered</li>
              <li>Signs disappear</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Stooplify Makes It Easy
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Browse nearby sales</li>
              <li>View on a map or list</li>
              <li>See photos, dates, and times</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-8">
              Whether you're hunting deals or just love thrifting, Stooplify keeps everything in one place.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('YardSales')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 Browse yard sales near you
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