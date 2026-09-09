import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Calendar, Clock, ArrowRight, Eye } from 'lucide-react';
import { format } from 'date-fns';

function formatDate(date) {
  if (!date) return 'TBD';
  const [y, m, d] = date.split('-').map(Number);
  return format(new Date(y, m - 1, d), 'EEE, MMM d');
}

export default function FeaturedSaleCard({ sale }) {
  return (
    <Link
      to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {sale.photos && sale.photos.length > 0 ? (
          <img
            src={sale.photos[0]}
            alt={sale.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            width={400}
            height={250}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-10 w-10 text-primary/30" />
          </div>
        )}
        {sale.categories && sale.categories.length > 0 && (
          <div className="absolute left-3 top-3 flex gap-1.5">
            {sale.categories.slice(0, 2).map((cat) => (
              <span key={cat} className="rounded-full border border-white/40 bg-white/85 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium capitalize text-slate-800">
                {cat.replace('-', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {sale.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            {formatDate(sale.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-accent-warm" />
            {sale.start_time || '8am'} – {sale.end_time || '2pm'}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-5">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            {sale.views || 0} views
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}