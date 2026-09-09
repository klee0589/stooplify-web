import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, subtitle, align = 'left', action }) {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-10 flex flex-col gap-4 ${centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-warm" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-h2 font-heading font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-3 text-base text-muted-foreground leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}