import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ArrowRight, Star, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { format, parseISO } from 'date-fns';
import { buildSaleUrl } from './SalePage';

export default function SellerPage() {
  const pathname = window.location.pathname; // /seller/username
  const username = pathname.replace('/seller/', '').toLowerCase();

  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ['sellerByUsername', username],
    queryFn: async () => {
      const users = await base44.entities.User.list();
      return users.find(u => (u.username || '').toLowerCase() === username) || null;
    },
    enabled: !!username,
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['sellerSales', seller?.email],
    queryFn: async () => {
      if (!seller?.email) return [];
      return await base44.entities.YardSale.filter({ created_by: seller.email, status: 'approved' }, '-date', 50);
    },
    enabled: !!seller?.email,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['sellerReviews', seller?.email, sales],
    queryFn: async () => {
      if (!sales.length) return [];
      const saleIds = sales.map(s => s.id);
      const allReviews = await Promise.all(
        saleIds.slice(0, 10).map(id => base44.entities.YardSaleReview.filter({ yard_sale_id: id }))
      );
      return allReviews.flat();
    },
    enabled: !!sales.length,
  });

  const now = new Date();
  const upcomingSales = sales.filter(s => new Date(s.date) >= now);
  const pastSales = sales.filter(s => new Date(s.date) < now);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const isLoading = sellerLoading || salesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14B8FF] border-t-transparent" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">Seller not found</h1>
        <p className="text-gray-500 mb-6">The username <strong>@{username}</strong> doesn't exist on Stooplify.</p>
        <Link to={createPageUrl('YardSales')}><Button className="bg-[#14B8FF] text-white">Browse All Sales</Button></Link>
      </div>
    );
  }

  const displayName = seller.full_name || seller.username || username;
  const canonicalUrl = `https://stooplify.com/seller/${username}`;
  const metaTitle = `${displayName} — Stooplify Seller | ${seller.location || 'Local Yard Sales'}`;
  const metaDescription = seller.bio || `Browse yard sales and stoop sales by ${displayName} on Stooplify. ${upcomingSales.length} upcoming sale${upcomingSales.length !== 1 ? 's' : ''}.`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={`${displayName} yard sale, ${seller.location || ''} stoop sale, stooplify seller`}
        url={canonicalUrl}
        image={seller.profile_picture}
      />

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#1a2842] to-[#14B8FF] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {seller.profile_picture ? (
              <img src={seller.profile_picture} alt={displayName}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/30" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">{displayName[0]?.toUpperCase()}</span>
              </div>
            )}
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{displayName}</h1>
            <p className="text-white/80 text-sm mb-3">@{username}</p>
            {seller.location && (
              <div className="flex items-center justify-center gap-1 text-white/80 text-sm mb-3">
                <MapPin className="w-4 h-4" /> {seller.location}
              </div>
            )}
            {seller.bio && <p className="text-white/90 max-w-lg mx-auto mb-4">{seller.bio}</p>}

            <div className="flex flex-wrap justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{sales.length}</div>
                <div className="text-white/70 text-xs">Total Sales</div>
              </div>
              {avgRating && (
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center gap-1 justify-center">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />{avgRating}
                  </div>
                  <div className="text-white/70 text-xs">{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold">{upcomingSales.length}</div>
                <div className="text-white/70 text-xs">Upcoming</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upcoming Sales */}
        {upcomingSales.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Upcoming Sales
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {upcomingSales.map((sale, i) => (
                <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={buildSaleUrl(sale)}
                    className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-[#14B8FF] hover:shadow-lg transition-all group">
                    {sale.photos?.[0] && (
                      <img src={sale.photos[0]} alt={sale.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#14B8FF] transition-colors">{sale.title}</h3>
                      <ArrowRight className="w-4 h-4 text-[#14B8FF] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(parseISO(sale.date), 'MMM d, yyyy')}</span>
                      {sale.start_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{sale.start_time}</span>}
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{sale.general_location}</span>
                    </div>
                    {sale.categories?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {sale.categories.slice(0, 3).map(c => <Badge key={c} className="bg-[#14B8FF]/10 text-[#14B8FF] text-xs">{c}</Badge>)}
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-3">
              {reviews.slice(0, 6).map((review, i) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{review.user_email?.split('@')[0]}</span>
                  </div>
                  {review.comment && <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Past Sales */}
        {pastSales.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Past Sales ({pastSales.length})
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {pastSales.slice(0, 6).map(sale => (
                <Link key={sale.id} to={buildSaleUrl(sale)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-[#14B8FF] transition-all group opacity-75 hover:opacity-100">
                  <p className="font-medium text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#14B8FF] truncate">{sale.title}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{format(parseISO(sale.date), 'MMM d, yyyy')}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {upcomingSales.length === 0 && pastSales.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sales listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}