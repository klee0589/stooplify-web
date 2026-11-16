import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Gift, ArrowUpRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import DiscoveryDropdowns from '../sales/DiscoveryDropdowns';
import SectionHeader from './SectionHeader';
import HomePhoto from './HomePhoto';

const FINDS = [
  { title: 'Give your space some character', label: 'Furniture & home', href: '/furniture-yard-sales', image: 'home' },
  { title: 'Find your next favorite story', label: 'Books & paperbacks', href: '/book-sales', image: 'records' },
  { title: 'Make secondhand your style', label: 'Vintage clothing', href: '/vintage-clothing-stoop-sales', image: 'hosting' },
];

export default function DiscoverBand() {
  return (
    <section className="py-16 md:py-20 bg-card border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="A little local inspiration"
          title="What will you find around the corner?"
          subtitle="Preloved pieces, unexpected treasures, and a good reason to explore your neighborhood."
          action={<Link to="/yard-sales" className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Explore all sales <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>}
        />

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {FINDS.map(find => (
            <Link key={find.href} to={find.href} className="group overflow-hidden rounded-2xl border border-border bg-background shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <HomePhoto image={find.image} sizes="(min-width: 1280px) 384px, (min-width: 640px) 31vw, 100vw" className={`motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105 ${find.image === 'hosting' ? 'object-right' : ''}`} />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm">{find.label}</span>
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">{find.title}</h3>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-accent-warm" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-4 shadow-card sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <span className="shrink-0 text-sm font-medium text-muted-foreground">Explore NYC &amp; NJ by</span>
            <DiscoveryDropdowns />
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/yard-sales" onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'browse_map' } })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 font-heading font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
            <Map className="h-5 w-5" aria-hidden="true" /> Browse the live map
          </Link>
          <Link to="/free-items" onClick={() => base44.analytics.track({ eventName: 'homepage_cta_clicked', properties: { cta: 'free_items' } })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3 font-heading font-semibold text-foreground shadow-sm transition-colors hover:border-accent-warm hover:text-accent-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
            <Gift className="h-5 w-5" aria-hidden="true" /> Free items near me
          </Link>
        </div>
      </div>
    </section>
  );
}
