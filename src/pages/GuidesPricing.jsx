import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Home, ChevronRight } from 'lucide-react';

export default function GuidesPricing() {
  useEffect(() => {
    document.title = 'How to Price Items for a Yard Sale - Simple Rules | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn how to price yard sale items to sell fast. Simple pricing rules for clothes, furniture, books, and more at NYC yard sales.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Price Items for a Yard Sale",
      "description": "Simple pricing rules for yard sale items",
      "image": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da",
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
          <span className="text-[#2E3A59] font-medium">Pricing Tips</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop" 
            alt="Items with price tags at yard sale"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How to Price Items for a Yard Sale
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Pricing doesn't have to be stressful.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Simple Pricing Rules
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li><strong>Most items: 25–30% of retail price</strong></li>
              <li>Clothes: $1–$5</li>
              <li>Books: $1–$2</li>
              <li>Small furniture: price to move, not to store</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pro Tips
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Round prices make cash easier</li>
              <li>Expect negotiation — it's part of the fun</li>
              <li>Lower prices later in the day</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-8">
              Photos on your Stooplify listing help buyers decide before they arrive, saving everyone time.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('AddYardSale')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 List your yard sale with photos
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