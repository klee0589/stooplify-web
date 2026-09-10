import React from 'react';
import { DollarSign, CreditCard, Smartphone } from 'lucide-react';

export default function SalePaymentOptions({ sale }) {
  if (!(sale.payment_cash || sale.payment_card || sale.payment_digital)) return null;
  const chip = 'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium text-foreground';
  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-card">
      <h3 className="font-heading font-semibold text-foreground mb-3">Payment Options</h3>
      <div className="flex flex-wrap gap-3">
        {sale.payment_cash && (
          <div className={`${chip} ${sale.cash_preferred ? 'bg-emerald-500/10 border-emerald-500' : 'bg-muted border-border'}`}>
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Cash {sale.cash_preferred && '(Preferred)'}
          </div>
        )}
        {sale.payment_card && (
          <div className={`${chip} bg-muted border-border`}>
            <CreditCard className="w-5 h-5 text-primary" />
            Credit/Debit
          </div>
        )}
        {sale.payment_digital && (
          <div className={`${chip} bg-muted border-border`}>
            <Smartphone className="w-5 h-5 text-accent-warm" />
            Digital Payments
          </div>
        )}
      </div>
    </div>
  );
}