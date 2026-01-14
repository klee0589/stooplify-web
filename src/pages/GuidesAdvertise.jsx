import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Megaphone, Home, ChevronRight } from 'lucide-react';

export default function GuidesAdvertise() {
  useEffect(() => {
    document.title = 'How to Advertise a Yard Sale in NYC - Free & Easy | Stooplify';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Learn how to advertise your yard sale in NYC for free. Reach local buyers in Brooklyn, Queens, and Manhattan without printed signs or Facebook groups.');
    }
    
    // Add JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Advertise a Yard Sale in NYC (Free & Easy)",
      "description": "Learn how to advertise your yard sale in New York City for free and reach local buyers effectively",
      "image": "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
      "author": {
        "@type": "Organization",
        "name": "Stooplify"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Stooplify",
        "logo": {
          "@type": "ImageObject",
          "url": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
        }
      },
      "datePublished": "2026-01-14",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to={createPageUrl('Home')} className="hover:text-[#FF6F61] flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={createPageUrl('Guides')} className="hover:text-[#FF6F61]">
            Guides
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2E3A59] font-medium">Advertise Your Sale</span>
        </nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-lg"
        >
          <img 
            src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&h=400&fit=crop" 
            alt="Yard sale signs and neighborhood"
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <Megaphone className="w-8 h-8 text-blue-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How to Advertise a Yard Sale in NYC (Free & Easy)
            </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Hosting a yard sale in New York City — whether in Brooklyn, Queens, Manhattan, or the Bronx — is a great way to clean out your home and make extra cash. But getting people to actually show up can be tough.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Between busy NYC streets, crowded neighborhoods, and disappearing flyers, many great yard sales get missed. That's why advertising your sale the right way matters for reaching local buyers.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Traditional Ways People Advertise Yard Sales
            </h2>

            <p className="text-gray-700 mb-4">Most people start with:</p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Handwritten signs on lamp posts</li>
              <li>Word of mouth with neighbors</li>
              <li>Posting in Facebook groups</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              These work… sometimes. But signs get taken down, posts get buried, and not everyone checks social media every day.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              A Better Way to Reach Local Buyers
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              Stooplify helps you advertise your yard sale to people already looking for one nearby.
            </p>

            <p className="text-gray-700 mb-4">With Stooplify, you can:</p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>List your yard sale in minutes</li>
              <li>Add photos and descriptions</li>
              <li>Choose the date and time</li>
              <li>Show up on a map for local shoppers</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-6">
              No printing signs. No chasing group admins. Just post and go.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Why Stooplify Works Better
            </h2>

            <p className="text-gray-700 mb-4">People open Stooplify because they want to:</p>

            <ul className="space-y-2 mb-6 text-gray-700">
              <li>Find yard sales happening now</li>
              <li>Plan weekend thrifting</li>
              <li>Discover local deals</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-8">
              That means better buyers and more foot traffic for your sale.
            </p>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link to={createPageUrl('AddYardSale')}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                  >
                    👉 List your yard sale on Stooplify
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