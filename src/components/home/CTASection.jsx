import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Plus, ArrowRight, Tag, Users, TrendingUp } from 'lucide-react';

export default function CTASection() {
  const stats = [
    { icon: Tag, value: '1,000+', label: 'Active Sales' },
    { icon: Users, value: '50K+', label: 'Happy Shoppers' },
    { icon: TrendingUp, value: '$2M+', label: 'Items Sold' },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E3A59] to-[#1a2238]">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#FF6F61]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Ready to Host Your{' '}
              <span className="text-[#FF6F61]">Own Sale?</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Turn your unused items into cash. List your yard sale for free and reach thousands of local shoppers looking for their next great find.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('AddYardSale')}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 111, 97, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Plus className="w-5 h-5" />
                  List Your Sale Free
                </motion.button>
              </Link>
              <Link to={createPageUrl('YardSales')}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-semibold flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Browse Sales
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10"
              >
                <div className="w-12 h-12 bg-[#FF6F61]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-[#FF6F61]" />
                </div>
                <p 
                  className="text-2xl md:text-3xl font-bold text-white mb-1"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}