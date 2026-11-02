import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Navigation, PlusCircle, Camera, BellRing, ArrowRight } from 'lucide-react';
import { createPageUrl } from '../../utils';
import SectionHeader from './SectionHeader';
import WeekendAlertSignup from '../WeekendAlertSignup';

const MODES = {
  shopping: {
    label: "I'm shopping",
    tint: 'bg-primary text-primary-foreground',
    cta: { text: 'Start exploring the map', href: createPageUrl('yard-sales'), icon: MapPin },
    steps: [
      {
        icon: MapPin,
        title: 'Open the map',
        desc: 'Your neighborhood and the sales near it, live. Filter by borough, date, or category.',
      },
      {
        icon: Heart,
        title: 'Save the good ones',
        desc: 'Tap the heart on any sale to build your treasure list for the weekend.',
      },
      {
        icon: Navigation,
        title: 'Show up first',
        desc: 'One-tap directions, start times, and a weather check for the day of the sale.',
      },
    ],
  },
  selling: {
    label: "I'm selling",
    tint: 'bg-accent-warm text-accent-warm-foreground',
    cta: { text: 'Post your sale — it’s free', href: createPageUrl('add-yard-sale'), icon: PlusCircle },
    steps: [
      {
        icon: PlusCircle,
        title: 'Post it free',
        desc: 'Snap a few photos, add your address and hours. No fees, no upgrade, no limit.',
      },
      {
        icon: Camera,
        title: 'Get on the map',
        desc: 'Your sale shows up on the live map and in neighborhood pages the moment you publish.',
      },
      {
        icon: BellRing,
        title: 'Let neighbors know',
        desc: 'Nearby buyers get alerted, so your stoop is busy before you set up the folding table.',
      },
    ],
  },
};

export default function HowItWorks() {
  const [mode, setMode] = useState('shopping');
  const active = MODES[mode];

  return (
    <section id="how-it-works" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="How it works"
          title="Two ways to use Stooplify"
          subtitle="Hunting for hidden gems or clearing out the apartment? Pick a side — it takes about a minute."
        />

        {/* Mode switch */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex gap-1 rounded-full border border-border bg-card p-1 shadow-card">
            {Object.entries(MODES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  mode === key ? value.tint : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {active.steps.map((step, i) => (
            <motion.div
              key={`${mode}-${step.title}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="pointer-events-none absolute -right-2 -top-4 font-heading text-7xl font-bold text-foreground/5">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between gap-6 rounded-2xl bg-primary/5 p-6 sm:p-8 lg:col-span-7"
          >
            <p className="max-w-md font-heading text-xl font-semibold leading-snug text-foreground">
              {mode === 'shopping'
                ? 'No account needed to browse. Save sales when you’re ready.'
                : 'Sellers keep 100% of what they make — listing is always free.'}
            </p>
            <Link
              to={active.cta.href}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md sm:w-auto sm:self-start"
            >
              <active.cta.icon className="h-5 w-5" />
              {active.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-2 shadow-card lg:col-span-5"
          >
            <WeekendAlertSignup variant="banner" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}