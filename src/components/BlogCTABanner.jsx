import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MapPin, Plus } from 'lucide-react';

export default function BlogCTABanner() {
  return (
    <div className="bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl p-6 my-8 text-white text-center shadow-lg">
      <p className="text-lg font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
        🏷️ Hosting a stoop sale?
      </p>
      <p className="text-white/90 text-sm mb-4">Post it free on Stooplify — reach local buyers in minutes.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to={createPageUrl('add-yard-sale')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Post Your Sale Free
        </Link>
        <Link
          to={createPageUrl('yard-sales')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 text-white border border-white/40 rounded-xl font-semibold hover:bg-white/30 transition-colors text-sm"
        >
          <MapPin className="w-4 h-4" />
          View Sales Near You
        </Link>
      </div>
    </div>
  );
}