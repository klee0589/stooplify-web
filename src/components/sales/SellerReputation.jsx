import React from 'react';
import { Calendar, Users, Star, Award } from 'lucide-react';

export default function SellerReputation({ seller, averageRating, totalReviews, totalSales }) {
  if (!seller) return null;

  const salesCount = totalSales || 0;
  const isRepeatSeller = salesCount >= 3;

  if (salesCount === 0 && !averageRating) return null;

  return (
    <div className="bg-[#2E3A59]/5 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#2E3A59] uppercase tracking-wide">
          Seller Reputation
        </p>
        {isRepeatSeller && (
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F5A623]/20 rounded-full">
            <Award className="w-3 h-3 text-[#F5A623]" />
            <span className="text-xs font-semibold text-[#F5A623]">Repeat Seller</span>
          </div>
        )}
      </div>
      
      {averageRating && totalReviews > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
            <span className="font-semibold text-[#2E3A59]">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-600">
            ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
          </span>
        </div>
      )}
      
      {salesCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-[#FF6F61]" />
          <span>Hosted {salesCount} sale{salesCount !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}