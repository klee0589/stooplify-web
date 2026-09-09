import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';

export default function FinalCta() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent-warm py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-display font-heading font-bold text-white">
          The best stoop sales in NYC &amp; New Jersey
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85 leading-relaxed">
          Brooklyn, Queens, Manhattan, the Bronx, Jersey City, Hoboken — find the best local sales near you, updated every day.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/yard-sales"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 font-heading font-semibold text-slate-900 shadow-glass hover:bg-white/95 transition-all"
          >
            <MapPin className="h-5 w-5" />
            Find sales near me
          </a>
          <a
            href="/add-yard-sale"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 font-heading font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
          >
            <Plus className="h-5 w-5" />
            Post your sale free
          </a>
        </div>
      </div>
    </motion.section>
  );
}