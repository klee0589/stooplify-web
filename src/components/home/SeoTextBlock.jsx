import React from 'react';
import { Link } from 'react-router-dom';

const BOROUGH_LINKS = [
  { label: 'Garage Sales NYC', url: '/garage-sales-nyc' },
  { label: 'Stoop Sales NYC', url: '/stoop-sales-nyc' },
  { label: 'Brooklyn Garage Sales', url: '/garage-sales-brooklyn' },
  { label: 'Manhattan Garage Sales', url: '/garage-sales-manhattan' },
  { label: 'Queens Garage Sales', url: '/garage-sales-queens' },
  { label: 'Bronx Garage Sales', url: '/garage-sales-bronx' },
  { label: 'Jersey City Sales', url: '/stoop-sales-jersey-city' },
];

export default function SeoTextBlock() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-h2 font-heading font-semibold text-foreground">
              Stoop sales &amp; yard sales across NYC &amp; New Jersey
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Stooplify is the easiest way to find <strong className="font-semibold text-foreground">stoop sales, yard sales, and garage sales</strong> across <strong className="font-semibold text-foreground">Brooklyn, Queens, Manhattan, the Bronx, Staten Island, Jersey City, Hoboken, and Newark</strong>.
            </p>
            <p>
              Neighbors across NYC and New Jersey set up sales every weekend — browse live listings in Williamsburg, Park Slope, Bushwick, Crown Heights, Bed-Stuy, Astoria, the Upper West Side, and beyond.
            </p>
            <p>
              Or <a href="/add-yard-sale" className="font-medium text-primary hover:underline">list your own stoop sale for free</a> and reach buyers already searching in your neighborhood.
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              {BOROUGH_LINKS.map(link => (
                <Link key={link.url} to={link.url} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card hover:border-primary hover:text-primary transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}