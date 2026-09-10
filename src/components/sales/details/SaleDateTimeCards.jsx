import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function SaleDateTimeCards({ sale, t }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-3 bg-card border border-border px-4 py-3 rounded-2xl shadow-card">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('date')}</p>
          <p className="font-semibold text-foreground">
            {sale.date ? format(new Date(sale.date), 'EEEE, MMMM d, yyyy') : t('dateTBD')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-card border border-border px-4 py-3 rounded-2xl shadow-card">
        <div className="w-10 h-10 bg-accent-warm/10 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-accent-warm" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('time')}</p>
          <p className="font-semibold text-foreground">
            {sale.start_time || '8:00 AM'} - {sale.end_time || '2:00 PM'}
          </p>
        </div>
      </div>
    </div>
  );
}