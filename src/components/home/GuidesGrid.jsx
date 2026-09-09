import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

const GUIDES = [
  { label: 'Advertise Your Sale', url: '/guides-advertise-yard-sale', num: '01', tag: 'Marketing' },
  { label: 'Best Days & Times', url: '/guides-best-time-yard-sale', num: '02', tag: 'Timing' },
  { label: 'Permit Requirements', url: '/guides-permit-requirements-nyc', num: '03', tag: 'Legal · NYC' },
  { label: 'Pricing Your Items', url: '/guides-pricing-yard-sale-items', num: '04', tag: 'Strategy' },
  { label: 'Guide for Seniors', url: '/guides-seniors-yard-sales', num: '05', tag: 'Accessibility' },
  { label: 'Finding Sales Near You', url: '/guides-find-yard-sales', num: '06', tag: 'Discovery' },
];

export default function GuidesGrid() {
  return (
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="NYC & NJ seller tips"
          title="Yard sale guides"
          subtitle="Everything you need to host or find an amazing sale in NYC and New Jersey."
          action={
            <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              View all guides <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide, i) => (
            <motion.div key={guide.url} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={guide.url} className="group flex h-full min-h-[150px] flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">{guide.num}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-warm transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{guide.label}</h3>
                  <span className="mt-3 inline-block rounded-full bg-accent-warm/10 px-2.5 py-0.5 text-xs font-medium text-accent-warm">{guide.tag}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}