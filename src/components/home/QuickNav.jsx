import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, CalendarDays, Gift, PlusCircle, BookOpen, Heart } from 'lucide-react';
import { createPageUrl } from '../../utils';

const LINKS = [
  {
    title: 'Live map',
    sub: 'See every sale',
    href: createPageUrl('yard-sales'),
    icon: Map,
    tint: 'bg-primary/10 text-primary',
  },
  {
    title: 'This weekend',
    sub: 'Plan your route',
    href: createPageUrl('Calendar'),
    icon: CalendarDays,
    tint: 'bg-amber-500/10 text-amber-600',
  },
  {
    title: 'Free stuff',
    sub: 'Curbside finds',
    href: '/free-items',
    icon: Gift,
    tint: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'Post a sale',
    sub: 'Free in 2 minutes',
    href: createPageUrl('add-yard-sale'),
    icon: PlusCircle,
    tint: 'bg-accent-warm/10 text-accent-warm',
  },
  {
    title: 'Guides',
    sub: 'Price & host tips',
    href: createPageUrl('Guides'),
    icon: BookOpen,
    tint: 'bg-violet-500/10 text-violet-600',
  },
  {
    title: 'My favorites',
    sub: 'Sales you saved',
    href: createPageUrl('Favorites'),
    icon: Heart,
    tint: 'bg-rose-500/10 text-rose-600',
  },
];

export default function QuickNav() {
  return (
    <section className="border-y border-border bg-card py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Jump straight in
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LINKS.map((link, i) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <Link
                to={link.href}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.tint}`}>
                  <link.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{link.sub}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}