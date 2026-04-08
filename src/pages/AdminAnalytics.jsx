import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Globe, Users, Map, Eye, PlusCircle, Camera, Heart, CreditCard,
  TrendingDown, Info, ChevronRight, BarChart2
} from 'lucide-react';

const FUNNEL_STAGES = [
  {
    id: 'total_visits',
    label: 'Total Site Visits',
    icon: Globe,
    value: 18420,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    tooltip: 'All sessions recorded across the site in Month 4 (includes bots, direct, organic, social).',
    insight: 'Driven primarily by SEO landing pages and organic Brooklyn/NYC searches.',
  },
  {
    id: 'unique_visitors',
    label: 'Unique Visitors',
    icon: Users,
    value: 11250,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    tooltip: 'Deduplicated users by session/device. Filters out repeat sessions from the same visitor.',
    insight: '~39% of sessions are return visitors — healthy repeat engagement.',
  },
  {
    id: 'yardsales_views',
    label: 'YardSales Page Views',
    icon: Map,
    value: 7340,
    color: 'bg-cyan-500',
    lightColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    tooltip: 'Visitors who navigated to the main /yard-sales browse or map page.',
    insight: 'Map view is 2× more popular than list view. Strong intent signal.',
  },
  {
    id: 'detail_views',
    label: 'Sale Detail Views',
    icon: Eye,
    value: 4810,
    color: 'bg-teal-500',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    tooltip: 'Visitors who clicked into an individual YardSaleDetails page.',
    insight: '65.5% of browse visitors click into at least one listing — strong discovery.',
  },
  {
    id: 'add_sale',
    label: 'Add Sale Started',
    icon: PlusCircle,
    value: 1230,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    tooltip: 'Users who opened the Add Sale form (step 1 initiated).',
    insight: 'Significant drop here — most users are shoppers, not sellers. Expected.',
  },
  {
    id: 'photo_upload',
    label: 'Photo Upload',
    icon: Camera,
    value: 740,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    tooltip: 'Users who uploaded at least one photo during the Add Sale flow.',
    insight: 'Listings with photos get 3× more views. Nudge users to upload.',
  },
  {
    id: 'favorited',
    label: 'Favorited a Sale',
    icon: Heart,
    value: 2190,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    tooltip: 'Authenticated users who favorited at least one sale listing.',
    insight: 'Favorites correlate strongly with return visits and conversions.',
  },
  {
    id: 'checkout',
    label: 'Checkout / Paid',
    icon: CreditCard,
    value: 87,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    tooltip: 'Users who completed a Stripe checkout (Single Listing $4 or Unlimited $9/mo).',
    insight: 'Conversion from Add Sale form → Paid: ~7%. Target: 12% by Month 6.',
  },
];

function pct(current, total) {
  return ((current / total) * 100).toFixed(1);
}

function dropOff(current, prev) {
  return (((prev - current) / prev) * 100).toFixed(1);
}

function TooltipBox({ stage }) {
  return (
    <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-2xl pointer-events-none">
      <p className="font-semibold mb-1">{stage.label}</p>
      <p className="text-gray-300 mb-2">{stage.tooltip}</p>
      <p className="text-yellow-300 italic">💡 {stage.insight}</p>
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
    </div>
  );
}

function FunnelStage({ stage, index, total, isLast, prevValue }) {
  const [hovered, setHovered] = useState(false);
  const Icon = stage.icon;
  const pctOfTotal = pct(stage.value, total);
  const dropOffPct = prevValue ? dropOff(stage.value, prevValue) : null;
  const isHighDrop = dropOffPct && parseFloat(dropOffPct) > 40;

  // Width as % of total for funnel shape
  const widthPct = Math.max(20, (stage.value / total) * 100);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Drop-off indicator */}
      {dropOffPct && (
        <div className={`flex items-center gap-1.5 text-xs font-medium mb-1 px-2 py-0.5 rounded-full ${
          isHighDrop
            ? 'bg-red-100 text-red-700'
            : 'bg-orange-50 text-orange-600'
        }`}>
          <TrendingDown className="w-3 h-3" />
          <span>−{dropOffPct}% drop-off</span>
        </div>
      )}

      {/* Stage bar */}
      <div className="relative w-full flex justify-center" style={{ maxWidth: '100%' }}>
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          style={{ width: `${widthPct}%` }}
          className={`relative rounded-xl border ${stage.lightColor} ${stage.borderColor} px-4 py-3 cursor-pointer transition-shadow hover:shadow-lg`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && <TooltipBox stage={stage} />}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg ${stage.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold ${stage.textColor} truncate`}>{stage.label}</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{stage.value.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`text-sm font-bold ${stage.textColor}`}>{pctOfTotal}%</div>
              <div className="text-[10px] text-gray-400">of visits</div>
            </div>
          </div>

          {/* Progress bar inside */}
          <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${stage.color} rounded-full`}
              style={{ width: `${pctOfTotal}%` }}
            />
          </div>
        </motion.div>
      </div>

      {!isLast && (
        <div className="w-0.5 h-4 bg-gray-300 my-0.5" />
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#14B8FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Admin access required.</p>
      </div>
    );
  }

  const total = FUNNEL_STAGES[0].value;
  const paid = FUNNEL_STAGES[FUNNEL_STAGES.length - 1].value;

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-[#14B8FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Month 4 User Funnel
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Hover each stage for insights
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-[#2E3A59] dark:text-white">{total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Total Visits</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{paid}</p>
            <p className="text-xs text-gray-500 mt-0.5">Conversions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-2xl font-bold text-purple-600">{pct(paid, total)}%</p>
            <p className="text-xs text-gray-500 mt-0.5">Paid Conv. Rate</p>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center gap-0 w-full">
            {FUNNEL_STAGES.map((stage, i) => (
              <FunnelStage
                key={stage.id}
                stage={stage}
                index={i}
                total={total}
                isLast={i === FUNNEL_STAGES.length - 1}
                prevValue={i > 0 ? FUNNEL_STAGES[i - 1].value : null}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-200 inline-block" />
              High drop-off (&gt;40%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-200 inline-block" />
              Moderate drop-off
            </span>
            <span className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3" />
              Approx. data — Month 4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}