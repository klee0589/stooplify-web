import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const posts = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    caption: 'Amazing finds spotted at a Brooklyn stoop sale this weekend 🛋️✨',
    platform: 'instagram',
  },
  {
    image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=400&fit=crop',
    caption: 'Vintage clothing haul from a Park Slope yard sale 👗🎉',
    platform: 'instagram',
  },
  {
    image: 'https://images.unsplash.com/photo-1464490188538-2279b0a5f8e3?w=400&h=400&fit=crop',
    caption: 'Classic furniture for under $20? Only at local stoop sales! 🪑',
    platform: 'instagram',
  },
  {
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop',
    caption: 'Spring cleanout season is HERE — list your stoop sale today 🌸',
    platform: 'instagram',
  },
];

export default function SocialSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            📸 Follow Along
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Stooplify on Social Media
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Follow us for sale spotlights, tips, and community finds from neighborhoods across NYC.
          </p>
        </motion.div>

        {/* Post grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/stooplify/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              className="relative group rounded-2xl overflow-hidden aspect-square block shadow-sm"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-3">
                <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug">
                  {post.caption}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="https://www.instagram.com/stooplify/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all"
            style={{
              background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <Instagram className="w-5 h-5" />
            Follow @stooplify
          </motion.a>

          <motion.a
            href="https://www.facebook.com/profile.php?id=61586102653727"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1877F2] text-white rounded-2xl font-semibold shadow-lg hover:bg-[#166fe5] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <FacebookIcon />
            Like us on Facebook
          </motion.a>
        </div>
      </div>
    </section>
  );
}