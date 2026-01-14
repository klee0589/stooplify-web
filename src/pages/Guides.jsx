import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { Book, Calendar, FileText, DollarSign, Users, MapPin, ArrowRight } from 'lucide-react';

const guides = [
  {
    id: 'advertise',
    title: 'How to Advertise a Yard Sale in NYC',
    description: 'Free and easy ways to reach local buyers and get more foot traffic',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
    page: 'GuidesAdvertise'
  },
  {
    id: 'timing',
    title: 'Best Days & Times to Host a Yard Sale',
    description: 'When to host for maximum turnout and sales',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-600',
    page: 'GuidesTimings'
  },
  {
    id: 'permit',
    title: 'Do You Need a Permit in New York?',
    description: 'Simple rules about yard sale permits in NYC',
    icon: FileText,
    color: 'bg-green-100 text-green-600',
    page: 'GuidesPermit'
  },
  {
    id: 'pricing',
    title: 'How to Price Items for a Yard Sale',
    description: 'Simple pricing rules to help your items sell',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-600',
    page: 'GuidesPricing'
  },
  {
    id: 'seniors',
    title: 'How Seniors Can Post a Yard Sale Online',
    description: 'Easy steps to list your sale without tech stress',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    page: 'GuidesSeniors'
  },
  {
    id: 'find',
    title: 'Where to Find Yard Sales Near You',
    description: 'How to discover the best local sales this weekend',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600',
    page: 'GuidesFindSales'
  },
];

export default function Guides() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6F61]/10 rounded-2xl mb-4">
            <Book className="w-8 h-8 text-[#FF6F61]" />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Yard Sale Guides
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to know about hosting and finding great yard sales in your neighborhood
          </p>
        </motion.div>

        {/* Guide Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(guide.page)}>
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${guide.color} mb-4`}>
                    <guide.icon className="w-6 h-6" />
                  </div>
                  <h3 
                    className="text-xl font-bold text-[#2E3A59] mb-3 group-hover:text-[#FF6F61] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center text-[#FF6F61] font-medium group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-[#FF6F61] to-[#14B8FF] rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Start?
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            List your yard sale or browse sales happening this weekend
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('AddYardSale')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#FF6F61] rounded-xl font-semibold shadow-lg"
              >
                List Your Sale
              </motion.button>
            </Link>
            <Link to={createPageUrl('YardSales')}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#2E3A59] text-white rounded-xl font-semibold shadow-lg"
              >
                Browse Sales
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}