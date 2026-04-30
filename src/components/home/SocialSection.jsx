import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

// Replace these URLs with your actual @stooplify post URLs
const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/p/REPLACE_POST_1/',
  'https://www.instagram.com/p/REPLACE_POST_2/',
  'https://www.instagram.com/p/REPLACE_POST_3/',
];

function InstagramEmbed({ url }) {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: '380px', width: '100%', minWidth: '280px' }}
      />
    </div>
  );
}

export default function SocialSection() {
  useEffect(() => {
    // Load Instagram embed script once
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
  }, []);

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
            @stooplify on Instagram
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Sale spotlights, community finds, and tips from neighborhoods across NYC.
          </p>
        </motion.div>

        {/* Instagram embeds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 justify-items-center">
          {INSTAGRAM_POST_URLS.map((url, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full max-w-sm"
            >
              <InstagramEmbed url={url} />
            </motion.div>
          ))}
        </div>

        {/* Follow button */}
        <div className="flex justify-center">
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
            Follow @stooplify on Instagram
          </motion.a>
        </div>
      </div>
    </section>
  );
}