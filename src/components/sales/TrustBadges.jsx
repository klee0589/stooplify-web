import React from 'react';
import { CheckCircle, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrustBadges({ seller, size = 'default' }) {
  if (!seller) return null;

  const badges = [];

  // Email verified
  if (seller.email_verified) {
    badges.push({
      icon: CheckCircle,
      label: 'Verified Email',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    });
  }

  // Phone verified
  if (seller.phone_verified) {
    badges.push({
      icon: Shield,
      label: 'Verified Phone',
      color: 'text-green-600',
      bg: 'bg-green-50'
    });
  }

  // Trusted seller (3+ sales)
  if ((seller.sales_count || 0) >= 3) {
    badges.push({
      icon: Star,
      label: 'Trusted Seller',
      color: 'text-[#F5A623]',
      bg: 'bg-[#F5A623]/10'
    });
  }

  // New seller
  if ((seller.sales_count || 0) === 0) {
    badges.push({
      icon: Star,
      label: 'New Seller',
      color: 'text-gray-500',
      bg: 'bg-gray-100'
    });
  }

  const sizeClasses = size === 'small' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  const iconSize = size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-1 rounded-full font-medium ${badge.bg} ${badge.color} ${sizeClasses}`}
        >
          <badge.icon className={iconSize} />
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}