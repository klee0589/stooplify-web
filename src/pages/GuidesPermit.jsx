import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Home, ChevronRight } from 'lucide-react';

export default function GuidesPermit() {
  useEffect(() => {
    document.title = 'Do You Need a Permit for a Yard Sale in NYC? | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Do you need a permit to host a yard sale in New York City? Learn NYC yard sale rules and regulations for Brooklyn, Queens, and Manhattan.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": "Do you need a permit for a yard sale in New York City?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most small, casual yard sales in NYC do not require a permit if you're not blocking sidewalks, creating noise issues, or selling as a recurring business."
        }
      }]
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
          <span className="text-[#2E3A59] font-medium">NYC Permits</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&h=400&fit=crop" 
            alt="New York City neighborhood street"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Do You Need a Permit for a Yard Sale in New York?
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              This is a common question — and the answer depends on how you run your sale.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The Short Answer
            </h2>

            <p className="text-gray-700 mb-4">
              Most small, casual yard sales do not require a permit if:
            </p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>You're not blocking sidewalks</li>
              <li>You're not creating noise issues</li>
              <li>You're selling personal items</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Things to Avoid
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Blocking pedestrian traffic</li>
              <li>Using amplified music</li>
              <li>Turning it into a recurring business</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              If you're unsure, keeping your sale simple and low-key is the safest approach.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Safer Option
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Listing your sale online lets people find you without creating crowds or clutter.
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              Stooplify helps keep things local, calm, and community-friendly.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('YardSales')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 View yard sales happening this weekend
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