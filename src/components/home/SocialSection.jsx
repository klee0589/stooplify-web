import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

// Paste your actual Instagram post URLs here (copy from instagram.com/p/...)
const INSTAGRAM_POST_URLS = [
  'https://www.instagram.com/p/DYjCAH-DcLP/',
  'https://www.instagram.com/p/DYhkexbDduq/',
  'https://www.instagram.com/p/DYUsgjCEdbO/',
];

const MOCK_POSTS = [
  { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', caption: 'Amazing finds at this weekend\'s Park Slope stoop sale! Vintage furniture, books & more.', tag: 'Park Slope' },
  { image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop', caption: 'Williamsburg stoop sale season is here. Dozens of sales mapped on Stooplify.', tag: 'Williamsburg' },
  { image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=400&fit=crop', caption: 'From one stoop to another — your treasure is someone\'s Sunday morning find. List yours free!', tag: 'NYC' },
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
    center: { x: 0, scale: 1, zIndex: 10, opacity: 1 },
    right: { x: 220, scale: 0.85, zIndex: 5, opacity: 0.6 },
    left: { x: -220, scale: 0.85, zIndex: 5, opacity: 0.6 },
  };

  return (
    <div className="relative flex items-center justify-center" style={{ height: 340 }}>
      {posts.map((post, i) => {
        const style = posStyles[getPosition(i)];
        return (
          <motion.div
            key={i}
            animate={style}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            style={{ zIndex: style.zIndex, position: 'absolute' }}
            onClick={() => setActive(i)}
            className="cursor-pointer"
          >
            <div className="w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-card-hover">
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-warm text-white"><Instagram className="h-3 w-3" /></span>
                <span className="text-xs font-semibold text-foreground">stooplify</span>
              </div>
              <div className="aspect-square w-full overflow-hidden">
                <img src={post.image} alt={post.tag} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <p className="px-3 py-2 text-xs text-muted-foreground line-clamp-1">{post.caption}</p>
            </div>
          </motion.div>
        );
      })}
      <button onClick={() => setActive(i => (i - 1 + count) % count)} aria-label="Previous" className="absolute left-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card hover:shadow-card-hover transition-all">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => setActive(i => (i + 1) % count)} aria-label="Next" className="absolute right-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card hover:shadow-card-hover transition-all">
        <ChevronRight className="h-5 w-5" />
      </button>
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
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Follow along"
          title="@stooplify on Instagram"
          subtitle="Sale spotlights, community finds, and tips from neighborhoods across NYC."
        />

        {hasPosts ? (
          <div className="mb-10 grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
            {INSTAGRAM_POST_URLS.map((url, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="w-full max-w-sm">
                <InstagramEmbed url={url} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mb-10 overflow-hidden px-16"><InstagramCarousel /></div>
        )}

        <div className="flex justify-center">
          <a
            href="https://www.instagram.com/stooplify/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-7 font-heading font-semibold text-foreground shadow-card hover:shadow-card-hover hover:border-accent-warm hover:text-accent-warm transition-all"
          >
            <Instagram className="h-5 w-5" />
            Follow @stooplify on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}