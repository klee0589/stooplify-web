import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Calendar, MapPin, Clock, PlusCircle, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function WeekendSales() {
  // Calculate this weekend's date range (Saturday + Sunday)
  const getWeekendDates = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    let daysToSat = 6 - day;
    if (day === 0) daysToSat = -1; // Sunday: Saturday was yesterday

    const saturday = new Date(now);
    saturday.setDate(now.getDate() + daysToSat);
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    const fmt = (d) => d.toISOString().split('T')[0];
    return { satStr: fmt(saturday), sunStr: fmt(sunday) };
  };

  const { satStr, sunStr } = getWeekendDates();

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['weekendSales', satStr, sunStr],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, 'date', 50);
      return allSales.filter((sale) => {
        if (!sale.date) return false;
        return sale.date >= satStr && sale.date <= sunStr;
      });
    },
    staleTime: 120000,
  });

  const weekendLabel = (() => {
    const sat = parseISO(satStr);
    const sun = parseISO(sunStr);
    const sameMonth = sat.getMonth() === sun.getMonth();
    if (sameMonth) {
      return `${format(sat, 'MMM d')}–${format(sun, 'd')}`;
    }
    return `${format(sat, 'MMM d')} – ${format(sun, 'MMM d')}`;
  })();

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5" />
              {weekendLabel}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
              This Weekend's Sales
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Live yard sales & stoop sales happening near you this weekend
            </p>
          </div>
          <Link
            to="/yard-sales"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline whitespace-nowrap"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-card border border-border rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sales.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No sales listed for this weekend yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Know of a stoop sale? Add it in 30 seconds — free. Your listing reaches thousands of local buyers searching this weekend.
            </p>
            <Link
              to="/add-yard-sale"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              List Your Sale — Free
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sales.slice(0, 6).map((sale, i) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/YardSaleDetails?id=${sale.id}`}
                  className="block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary hover:shadow-card-hover transition-all group h-full"
                >
                  {sale.photos && sale.photos.length > 0 ? (
                    <div className="h-32 overflow-hidden bg-muted">
                      <img
                        src={sale.photos[0]}
                        alt={sale.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-accent-warm/10 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {sale.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(parseISO(sale.date), 'EEE, MMM d')}
                      </span>
                      {sale.start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {sale.start_time}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">
                        {sale.general_location || `${sale.city}, ${sale.state}`}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {sales.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/add-yard-sale"
              className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
            >
              <PlusCircle className="w-4 h-4" />
              List your sale — free
            </Link>
            <Link
              to="/yard-sales"
              className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline"
            >
              View all sales on the map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}