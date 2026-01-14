import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Home, ChevronRight } from 'lucide-react';

export default function GuidesSeniors() {
  useEffect(() => {
    document.title = 'How Seniors Can Post a Yard Sale Online - Easy Guide | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Simple guide for seniors to post yard sales online in NYC. No tech skills needed - list your sale in minutes in Brooklyn, Queens, or anywhere in New York.');
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How Seniors Can Post a Yard Sale Online",
      "description": "Simple steps for seniors to list yard sales online",
      "step": [
        {"@type": "HowToStep", "text": "Gather your address or nearest intersection"},
        {"@type": "HowToStep", "text": "Choose your date and time"},
        {"@type": "HowToStep", "text": "Add a short description (optional)"},
        {"@type": "HowToStep", "text": "Upload photos (optional but helpful)"}
      ]
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
          <span className="text-[#2E3A59] font-medium">For Seniors</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1560264280-88b68371db39?w=1200&h=400&fit=crop" 
            alt="Friendly neighborhood community"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6">
              <Users className="w-8 h-8 text-pink-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How Seniors Can Post a Yard Sale Online
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              You don't need to be tech-savvy to post a yard sale.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Stooplify is designed to be simple.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What You Need
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Address or nearest intersection</li>
              <li>Date and time</li>
              <li>Short description (optional)</li>
              <li>Photos (optional but helpful)</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              That's it.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Why This Helps
            </h2>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Fewer phone calls</li>
              <li>Less confusion</li>
              <li>Better buyers</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-8">
              Family members can also help create the listing in minutes.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('AddYardSale')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 Create a simple yard sale listing
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