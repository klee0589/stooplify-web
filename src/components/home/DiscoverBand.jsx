import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Gift } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DiscoveryDropdowns from '../sales/DiscoveryDropdowns';
import SectionHeader from './SectionHeader';

export default function DiscoverBand() {
  return (
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="NYC & NJ sales are live"
          title="What's happening in NYC & New Jersey"
          subtitle="Browse the live map across Brooklyn, Queens, Manhattan, the Bronx, and NJ — plan your weekend route before you leave home."
        />

        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-background p-4 sm:p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-center">
            <span className="text-sm font-medium text-muted-foreground shrink-0">Filter by</span>
            <DiscoveryDropdowns />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/yard-sales"
            onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'browse_map' } })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-heading font-semibold text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
          >
            <Map className="h-5 w-5" />
            Browse the live map
          </Link>
          <Link
            to="/free-items"
            onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'free_items' } })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 font-heading font-semibold text-foreground shadow-sm hover:shadow-md hover:border-accent-warm hover:text-accent-warm transition-all"
          >
            <Gift className="h-5 w-5" />
            Free items near me
          </Link>
        </div>
      </div>
    </section>
  );
}