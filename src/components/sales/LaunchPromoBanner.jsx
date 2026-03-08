import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Sparkles, X } from 'lucide-react';

export default function LaunchPromoBanner() {
  const [dismissed, setDismissed] = React.useState(() =>
    localStorage.getItem('promo_banner_dismissed') === 'true'
  );

  if (dismissed) return null;

  const handleDismiss = (e) => {
    e.preventDefault();
    localStorage.setItem('promo_banner_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-[#FF6F61] to-[#F5A623] text-white py-3 px-4 relative"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm font-medium">
          <span className="font-bold">Launch Promo</span> — Post Your First Stoop Sale{' '}
          <span className="font-bold underline">FREE</span>!{' '}
          <Link
            to={createPageUrl('AddYardSale')}
            className="ml-1 underline font-bold hover:opacity-90"
          >
            List Now →
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}