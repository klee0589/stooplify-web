import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=900&q=70&fit=crop';

export default function HeroPhotoCard({ photos: heroPhotos = [] }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = heroPhotos.length > 0 ? heroPhotos : [FALLBACK];

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => setPhotoIndex((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl border border-border bg-muted shadow-glass">
        {photos.map((src, i) => (
          <motion.img
            key={src + i}
            src={src}
            alt="Stoop sale photo"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: i === photoIndex ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            width={500}
            height={500}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/40 to-transparent" />
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                aria-label={`Photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all no-min-tap ${i === photoIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                style={{ minHeight: 0 }}
              />
            ))}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -top-4 -right-2 sm:-right-4 flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 dark:bg-card/80 backdrop-blur-md px-4 py-3 shadow-card"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MapPin className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Brooklyn · Queens · Manhattan</p>
          <p className="text-sm font-semibold text-foreground">&amp; All of NJ</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-4 -left-2 sm:-left-4 flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 dark:bg-card/80 backdrop-blur-md px-4 py-3 shadow-card"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-warm/10 text-accent-warm">
          <Tag className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Save big</p>
          <p className="text-sm font-semibold text-foreground">Up to 90% off retail</p>
        </div>
      </motion.div>
    </div>
  );
}