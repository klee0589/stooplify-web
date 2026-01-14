import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function GuidesFindSales() {
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
        </motion.article>
      </div>
    </div>
  );
}