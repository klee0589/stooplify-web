import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, ChevronLeft, ChevronRight } from 'lucide-react';

// Paste your actual Instagram post URLs here (copy from instagram.com/p/...)
const INSTAGRAM_POST_URLS = [
  // 'https://www.instagram.com/p/YOUR_POST_1/',
  // 'https://www.instagram.com/p/YOUR_POST_2/',
  // 'https://www.instagram.com/p/YOUR_POST_3/',
];

// Placeholder Instagram-style post cards for the carousel
const MOCK_POSTS = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    caption: '🛍️ Amazing finds at this weekend\'s Park Slope stoop sale! Vintage furniture, books & more.',
    likes: 142,
    tag: 'Park Slope',
  },
  {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop',
    caption: '🌇 Williamsburg stoop sale season is HERE. Dozens of sales mapped on Stooplify 📍',
    likes: 218,
    tag: 'Williamsburg',
  },
  {
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=400&fit=crop',
    caption: '✨ From one stoop to another — your treasure is someone\'s Sunday morning find. List yours free!',
    likes: 309,
    tag: 'NYC',
  },
];

function InstagramEmbed({ url }) {
  useEffect(() => {
    if (window.instgrm) window.instgrm.Embeds.process();
  }, [url]);

  return (
    <div className="flex justify-center w-full">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-captioned
        data-instgrm-version="14"
        style={{ maxWidth: '380px', width: '100%', minWidth: '280px', border: 0, margin: 0 }}
      />
    </div>
  );
}

function InstagramCarousel() {
  const [active, setActive] = useState(0);
  const posts = MOCK_POSTS;
  const count = posts.length;

  // Auto-rotate every 3.5s
  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % count), 3500);
    return () => clearInterval(timer);
  }, [count]);

  const getPosition = (i) => {
    const diff = (i - active + count) % count;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    return 'left';
  };

  const posStyles = {
    center: { x: 0, scale: 1, zIndex: 10, rotateY: 0, opacity: 1 },
    right:  { x: 220, scale: 0.8, zIndex: 5, rotateY: -18, opacity: 0.75 },
    left:   { x: -220, scale: 0.8, zIndex: 5, rotateY: 18, opacity: 0.75 },
  };

  return (
    <div className="relative flex justify-center items-center" style={{ height: 460, perspective: 1000 }}>
      {posts.map((post, i) => {
        const pos = getPosition(i);
        const style = posStyles[pos];
        return (
          <motion.div
            key={i}
            animate={{
              x: style.x,
              scale: style.scale,
              rotateY: style.rotateY,
              opacity: style.opacity,
              y: pos === 'center' ? [0, -10, 0] : 0,
            }}
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.4 },
              opacity: { duration: 0.4 },
              y: pos === 'center' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 },
            }}
            style={{ zIndex: style.zIndex, position: 'absolute', transformStyle: 'preserve-3d' }}
            onClick={() => setActive(i)}
            className="cursor-pointer"
          >
            <div className="w-72 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)' }}>
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-gray-800 dark:text-white">stooplify</span>
                <span className="ml-auto text-xs text-gray-400">{post.tag}</span>
              </div>
              {/* Image */}
              <div className="w-full aspect-square overflow-hidden">
                <img src={post.image} alt={post.tag} className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Caption */}
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">❤️ {post.likes} likes</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{post.caption}</p>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Nav buttons */}
      <button
        onClick={() => setActive(i => (i - 1 + count) % count)}
        className="absolute left-0 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setActive(i => (i + 1) % count)}
        className="absolute right-0 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-0 flex gap-2">
        {posts.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-pink-500 w-4' : 'bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
    </div>
  );
}

export default function SocialSection() {
  const hasPosts = INSTAGRAM_POST_URLS.length > 0;

  useEffect(() => {
    if (!hasPosts) return;
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [hasPosts]);

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
          <h2 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            @stooplify on Instagram
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Sale spotlights, community finds, and tips from neighborhoods across NYC.
          </p>
        </motion.div>

        {hasPosts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 justify-items-center">
            {INSTAGRAM_POST_URLS.map((url, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="w-full max-w-sm">
                <InstagramEmbed url={url} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mb-10 overflow-hidden px-16">
            <InstagramCarousel />
          </div>
        )}

        <div className="flex justify-center">
          <motion.a
            href="https://www.instagram.com/stooplify/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all"
            style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', fontFamily: 'Poppins, sans-serif' }}
          >
            <Instagram className="w-5 h-5" />
            Follow @stooplify on Instagram
          </motion.a>
        </div>
      </div>
    </section>
  );
}