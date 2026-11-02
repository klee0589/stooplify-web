import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Check, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SEO from '../components/SEO';

const INCLUDED = [
  'Unlimited listings — no monthly fee, no per-listing fee',
  'Up to 20 photos on every sale',
  'Pin your sale on the live neighborhood map',
  'Weekend alerts and buyer messages',
  'Verified seller badge via QR check-ins',
  'Free item giveaways for curbside pickups',
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <SEO
        title="Stooplify is Free | List Your Stoop Sale at No Cost"
        description="Listing a stoop, yard, or garage sale on Stooplify is completely free — unlimited listings, up to 20 photos, and live map placement. No subscriptions, no per-listing fees."
        keywords="free yard sale listing, free stoop sale listing, list garage sale free, nyc yard sales"
        url="https://stooplify.com/pricing"
        breadcrumbs={[{ name: 'Home', url: 'https://stooplify.com/' }, { name: 'Pricing', url: 'https://stooplify.com/pricing' }]}
      />

      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Free, and staying free
          </span>
          <h1 className="text-h2 font-heading font-semibold text-foreground mb-4">
            Everything on Stooplify is free
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            We're focused on getting more sales on the map and more people through your door. No
            subscriptions, no upgrade prompts, no limits on how many sales you can post.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl shadow-card p-8 text-left"
        >
          <h2 className="font-heading font-semibold text-foreground text-lg mb-5">
            What every seller gets
          </h2>
          <ul className="space-y-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link to={createPageUrl('add-yard-sale')} className="flex-1">
              <Button className="w-full rounded-xl">List your sale</Button>
            </Link>
            <Link to={createPageUrl('yard-sales')} className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">Browse sales</Button>
            </Link>
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground mt-6">
          Running a thrift shop, antique store, or flea market?{' '}
          <Link to={createPageUrl('ApplyAsShop')} className="text-primary hover:underline">
            Get listed for free too
          </Link>
          .
        </p>
      </div>
    </div>
  );
}