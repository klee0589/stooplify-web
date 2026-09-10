import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import SellerReputation from '@/components/sales/SellerReputation';

export default function SaleHostCard({ sale, seller, sellerSalesCount, sellerAverageRating, sellerReviewsCount, isOwner, onMessage }) {
  if (!(sale.created_by || sale.created_by_id)) return null;
  const name = seller?.full_name || (sale.created_by ? sale.created_by.split('@')[0] : 'Local Host');
  const initial = (seller?.full_name || seller?.email || sale.created_by || 'H')[0]?.toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      <h3 className="font-heading font-semibold text-foreground mb-4">Hosted By</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-warm rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{initial}</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-foreground capitalize">{name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {sellerSalesCount > 0 ? `${sellerSalesCount} ${sellerSalesCount === 1 ? 'sale' : 'sales'} hosted` : 'Stooplify seller'}
            {sellerAverageRating && ` • ⭐ ${sellerAverageRating.toFixed(1)} rating`}
          </p>
        </div>
      </div>

      <SellerReputation seller={seller} averageRating={sellerAverageRating} totalReviews={sellerReviewsCount} totalSales={sellerSalesCount} />

      {!isOwner && (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onMessage}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-card mt-4">
          <MessageCircle className="w-5 h-5" />
          Message Host via Stooplify
        </motion.button>
      )}
    </div>
  );
}