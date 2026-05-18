import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Eye, Heart, UserCheck, Star, TrendingUp, MessageCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SaleAnalytics({ sale, saleId }) {
  const { data: attendances = [] } = useQuery({
    queryKey: ['analyticsAttendance', saleId],
    queryFn: () => base44.entities.Attendance.filter({ yard_sale_id: saleId }),
    enabled: !!saleId,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['analyticsFavorites', saleId],
    queryFn: () => base44.entities.Favorite.filter({ yard_sale_id: saleId }),
    enabled: !!saleId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['analyticsReviews', saleId],
    queryFn: () => base44.entities.YardSaleReview.filter({ yard_sale_id: saleId }),
    enabled: !!saleId,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['analyticsMessages', saleId],
    queryFn: () => base44.entities.Message.filter({ yard_sale_id: saleId }),
    enabled: !!saleId,
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const stats = [
    {
      label: 'Views',
      value: sale.views || 0,
      icon: Eye,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Saves',
      value: favorites.length,
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Attending',
      value: attendances.length,
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Messages',
      value: messages.length,
      icon: MessageCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Reviews',
      value: reviews.length,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Avg Rating',
      value: avgRating ? `${avgRating} ⭐` : '—',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 className="w-5 h-5 text-[#14B8FF]" />
        <h3 className="font-semibold text-[#2E3A59] dark:text-white text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Listing Analytics
        </h3>
        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Free</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-full flex items-center justify-center mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold text-[#2E3A59] dark:text-white">{stat.value}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}