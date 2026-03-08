import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, X, Star, Camera, Calendar, MapPin } from 'lucide-react';

const PERKS = [
  { icon: Camera, text: 'Up to 15 photos per listing' },
  { icon: Calendar, text: 'Multi-day sale events' },
  { icon: Star, text: 'Featured placement on homepage' },
  { icon: MapPin, text: 'Highlighted map marker' },
  { icon: Sparkles, text: 'Priority search placement & social badge' },
];

export default function UpgradePrompt({ reason = 'photos', onUpgrade, onDismiss }) {
  const reasonMessages = {
    photos: "You've reached the 3-photo limit for free listings.",
    listing: "You've used your free listing for this period.",
    rate_limit: "You can only post 1 listing every 7 days on the free plan.",
    active_sale: "You already have an active sale. Free users can only have 1 at a time.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-[#FF6F61]/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6F61] to-[#F5A623] p-5 text-white relative">
        {onDismiss && (
          <button onClick={onDismiss} className="absolute top-3 right-3 p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Upgrade to Paid Listing
          </h3>
        </div>
        <p className="text-white/90 text-sm">{reasonMessages[reason]}</p>
      </div>

      {/* Perks */}
      <div className="p-5">
        <p className="text-sm font-semibold text-[#2E3A59] dark:text-white mb-3">What you unlock:</p>
        <ul className="space-y-2 mb-5">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Icon className="w-4 h-4 text-[#FF6F61] flex-shrink-0" />
              {text}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <button
            onClick={() => onUpgrade?.('single')}
            className="w-full py-3 border-2 border-[#FF6F61] text-[#FF6F61] rounded-xl font-semibold hover:bg-[#FF6F61] hover:text-white transition-all text-sm"
          >
            Single Listing — $4 one-time
          </button>
          <button
            onClick={() => onUpgrade?.('subscription')}
            className="w-full py-3 bg-[#FF6F61] text-white rounded-xl font-semibold hover:bg-[#e85d50] transition-all text-sm relative"
          >
            <span className="absolute -top-2 right-3 bg-[#F5A623] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Best Value
            </span>
            Unlimited — $9/month
          </button>
        </div>
      </div>
    </motion.div>
  );
}