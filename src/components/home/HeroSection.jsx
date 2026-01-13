import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await base44.entities.EmailSubscriber.create({ email, notify_new_sales: true });
      toast.success('Thanks for subscribing! We\'ll notify you about new sales.');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F4] via-white to-[#F5F7FF]">
        {/* Animated floating shapes */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[10%] w-32 h-32 bg-[#FF6F61]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[5%] w-40 h-40 bg-[#F5A623]/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[30%] w-24 h-24 bg-[#2E3A59]/5 rounded-full blur-xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F61]/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#FF6F61]" />
              <span className="text-sm font-medium text-[#FF6F61]">Discover Local Treasures</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E3A59] leading-tight mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Find Amazing{' '}
              <span className="relative">
                <span className="text-[#FF6F61]">Yard Sales</span>
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 10C40 2 120 2 198 10"
                    stroke="#F5A623"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              {' '}Near You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8 max-w-lg"
            >
              Connect with your community, discover hidden gems, and turn your unused items into cash. 
              Join thousands of neighbors finding amazing deals every weekend.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link to={createPageUrl('YardSales')}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 111, 97, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6F61] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#FF6F61]/25"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <MapPin className="w-5 h-5" />
                  Find Sales Near You
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to={createPageUrl('AddYardSale')}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-[#2E3A59] text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Plus className="w-5 h-5" />
                  Add Your Sale
                </motion.button>
              </Link>
            </motion.div>

            {/* Email Capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 max-w-md"
            >
              <p className="text-sm font-medium text-[#2E3A59] mb-3">
                🔔 Get notified about sales in your area
              </p>
              <form onSubmit={handleEmailSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border-gray-200 focus:border-[#FF6F61] focus:ring-[#FF6F61]"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl px-6"
                >
                  {isSubmitting ? 'Joining...' : 'Join'}
                </Button>
              </form>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Image Container */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#FF6F61]/20 to-[#F5A623]/20 rounded-[3rem] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
                    alt="Yard sale with vintage items"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                transition={{ delay: 0.8, duration: 3, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#FF6F61]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">This Weekend</p>
                    <p className="font-semibold text-[#2E3A59]">24 Sales Nearby</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, 5, 0] }}
                transition={{ delay: 1, duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F5A623]/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Savings</p>
                    <p className="font-semibold text-[#2E3A59]">Up to 90% Off</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}