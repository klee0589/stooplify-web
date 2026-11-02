import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BadgeDollarSign, MapPinned, ShieldCheck, Sun, Bell, Gift, ArrowRight,
} from 'lucide-react';
import { createPageUrl } from '../../utils';
import SectionHeader from './SectionHeader';

const BENEFITS = [
  {
    icon: BadgeDollarSign,
    title: 'Free to list, forever',
    desc: 'No listing fees, no commissions, no "premium" wall. Post one sale or ten.',
    tint: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: MapPinned,
    title: 'A map that is actually current',
    desc: 'Every listing expires after a week, so you never drive to a sale that ended last month.',
    tint: 'bg-primary/10 text-primary',
  },
  {
    icon: ShieldCheck,
    title: 'Verified sellers',
    desc: 'Buyers check in with a QR scan at the sale. Real visits earn sellers a verified badge.',
    tint: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: Sun,
    title: 'Weather on every sale',
    desc: 'See the forecast for sale day before you commit your Saturday morning.',
    tint: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: Bell,
    title: 'Weekend alerts',
    desc: 'One email with the sales worth leaving the house for. No spam, unsubscribe anytime.',
    tint: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: Gift,
    title: 'Free stuff, too',
    desc: 'Curbside piles and giveaways live in their own feed — take it before it hits the trash.',
    tint: 'bg-accent-warm/10 text-accent-warm',
  },
];

export default function Benefits() {
  return (
    <section className="border-y border-border bg-card py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Why Stooplify"
          title="Better than a group chat full of screenshots"
          subtitle="Yard sales scattered across social posts and classifieds are impossible to plan around. Stooplify puts them on one live map built for NYC and New Jersey."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-background p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${benefit.tint}`}>
                <benefit.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={createPageUrl('yard-sales')}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:w-auto"
          >
            Find sales near me
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/free-items"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 font-heading font-semibold text-foreground shadow-sm transition-all hover:border-accent-warm hover:text-accent-warm sm:w-auto"
          >
            <Gift className="h-5 w-5" />
            Browse free stuff
          </Link>
        </div>
      </div>
    </section>
  );
}