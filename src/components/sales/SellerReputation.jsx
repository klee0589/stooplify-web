import React from 'react';
import { Calendar, Users } from 'lucide-react';

export default function SellerReputation({ seller }) {
  if (!seller) return null;

  const salesCount = seller.sales_count || 0;
  const attendanceCount = seller.confirmed_attendance_count || 0;

  if (salesCount === 0 && attendanceCount === 0) return null;

  return (
    <div className="bg-[#2E3A59]/5 rounded-xl p-4 space-y-2">
      <p className="text-xs font-semibold text-[#2E3A59] uppercase tracking-wide">
        Seller History
      </p>
      
      {salesCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-[#FF6F61]" />
          <span>Hosted {salesCount} past sale{salesCount !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      {attendanceCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="w-4 h-4 text-[#2E3A59]" />
          <span>Last sale confirmed by attendees</span>
        </div>
      )}
    </div>
  );
}