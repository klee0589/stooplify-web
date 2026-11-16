import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import HomePhoto from './HomePhoto';

const FEATURED_GUIDES = [
  { label: 'Advertise Your Sale', url: '/guides-advertise-yard-sale', tag: 'Marketing', image: 'hosting' },
  { label: 'Best Days & Times', url: '/guides-best-time-yard-sale', tag: 'Timing', image: 'stoop' },
  { label: 'Pricing Your Items', url: '/guides-pricing-yard-sale-items', tag: 'Strategy', image: 'records' },
];

const MORE_GUIDES = [
  { label: 'Permit Requirements', url: '/guides-permit-requirements-nyc', tag: 'Legal · NYC' },
  { label: 'Guide for Seniors', url: '/guides-seniors-yard-sales', tag: 'Accessibility' },
  { label: 'Finding Sales Near You', url: '/guides-find-yard-sales', tag: 'Discovery' },
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
            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              View all guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {FEATURED_GUIDES.map((guide) => (
            <Link
              key={guide.url}
              to={guide.url}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <HomePhoto
                  image={guide.image}
                  className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.03]"
                  sizes="(min-width: 1280px) 384px, (min-width: 768px) 31vw, 100vw"
                />
              </div>
              <div className="flex flex-1 items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <span className="inline-block rounded-full bg-accent-warm/10 px-2.5 py-0.5 text-xs font-medium text-accent-warm">{guide.tag}</span>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{guide.label}</h3>
                </div>
                <ArrowUpRight className="mb-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent-warm" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {MORE_GUIDES.map((guide) => (
            <Link
              key={guide.url}
              to={guide.url}
              className="group flex min-h-[76px] items-center justify-between gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-card"
            >
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{guide.label}</h3>
                <span className="mt-1 block text-xs text-muted-foreground">{guide.tag}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent-warm" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
