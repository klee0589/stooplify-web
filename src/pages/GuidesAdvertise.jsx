import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Megaphone } from 'lucide-react';

export default function GuidesAdvertise() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <Megaphone className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How to Advertise a Yard Sale in NYC (Free & Easy)
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Hosting a yard sale in New York City is a great way to clean out your home and make extra cash — but getting people to actually show up can be tough.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Between busy streets, crowded neighborhoods, and disappearing flyers, many great yard sales get missed. That's why advertising your sale the right way matters.
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
        </motion.article>
      </div>
    </div>
  );
}