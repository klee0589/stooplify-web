import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';

export default function GuidesSeniors() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={createPageUrl('Guides')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Guides
          </motion.button>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg"
        >
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
        </motion.article>
      </div>
    </div>
  );
}