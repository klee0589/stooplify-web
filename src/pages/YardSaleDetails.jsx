import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  MapPin, Calendar, Clock, Heart, Share2, Navigation, 
  ChevronLeft, ChevronRight, X, ArrowLeft, Tag, UserCheck, Flag 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { toast } from "sonner";
import AddressDisplay from '../components/sales/AddressDisplay';
import TrustBadges from '../components/sales/TrustBadges';
import SellerReputation from '../components/sales/SellerReputation';
import ReportModal from '../components/sales/ReportModal';
import SafetyNote from '../components/sales/SafetyNote';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';

export default function YardSaleDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get('id');
  
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [seller, setSeller] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    checkAuth();
  }, []);

  const { data: sale, isLoading } = useQuery({
    queryKey: ['yardSale', saleId],
    queryFn: async () => {
      const sales = await base44.entities.YardSale.filter({ id: saleId });
      if (sales.length > 0) {
        // Increment views
        await base44.entities.YardSale.update(saleId, { views: (sales[0].views || 0) + 1 });
        
        // Fetch seller info
        if (sales[0].created_by) {
          const sellers = await base44.entities.User.filter({ email: sales[0].created_by });
          if (sellers.length > 0) {
            setSeller(sellers[0]);
          }
        }
        
        return sales[0];
      }
      return null;
    },
    enabled: !!saleId,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email, saleId],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Favorite.filter({ user_email: user.email, yard_sale_id: saleId });
    },
    enabled: !!user && !!saleId,
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendance', user?.email, saleId],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Attendance.filter({ user_email: user.email, yard_sale_id: saleId });
    },
    enabled: !!user && !!saleId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', saleId],
    queryFn: async () => {
      if (!saleId) return [];
      return await base44.entities.YardSaleReview.filter({ yard_sale_id: saleId }, '-created_date');
    },
    enabled: !!saleId,
  });

  useEffect(() => {
    setIsFavorite(favorites.length > 0);
  }, [favorites]);

  useEffect(() => {
    setIsAttending(attendances.length > 0);
  }, [attendances]);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      
      if (isFavorite) {
        const existing = favorites[0];
        if (existing) {
          await base44.entities.Favorite.delete(existing.id);
        }
      } else {
        await base44.entities.Favorite.create({ yard_sale_id: saleId, user_email: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      
      if (isAttending) {
        const existing = attendances[0];
        if (existing) {
          await base44.entities.Attendance.delete(existing.id);
        }
      } else {
        await base44.entities.Attendance.create({ 
          yard_sale_id: saleId, 
          user_email: user.email,
          notify_reminder: true
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(isAttending ? 'No longer attending' : '🎉 Attending! Exact address unlocked.');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ rating, comment }) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      
      // Check if user has already reviewed
      const existingReviews = await base44.entities.YardSaleReview.filter({ 
        yard_sale_id: saleId, 
        user_email: user.email 
      });
      
      if (existingReviews.length > 0) {
        toast.error('You have already reviewed this sale');
        return;
      }
      
      await base44.entities.YardSaleReview.create({
        yard_sale_id: saleId,
        user_email: user.email,
        rating,
        comment,
        attended: isAttending || attendances.length > 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review submitted!');
    },
  });

  const handleHelpful = async (reviewId) => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      await base44.entities.YardSaleReview.update(reviewId, {
        helpful_count: (review.helpful_count || 0) + 1
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Thanks for your feedback!');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: sale?.title,
        text: `Check out this yard sale: ${sale?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleGetDirections = () => {
    // Use exact coordinates if available and unlocked, otherwise use approximate
    if (sale?.exact_latitude && sale?.exact_longitude && (isAttending || isAddressUnlocked())) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${sale.exact_latitude},${sale.exact_longitude}`;
      window.open(url, '_blank');
    } else if (sale?.latitude && sale?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${sale.latitude},${sale.longitude}`;
      window.open(url, '_blank');
    } else if (sale?.address && (isAttending || isAddressUnlocked())) {
      const address = `${sale.address}, ${sale.city}, ${sale.state} ${sale.zip_code}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    } else {
      const address = `${sale?.general_location}, ${sale?.city}, ${sale?.state}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    }
  };

  const isAddressUnlocked = () => {
    if (!sale?.date || !sale?.start_time) return false;
    const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
    const now = new Date();
    const hoursUntilSale = (saleDateTime - now) / (1000 * 60 * 60);
    return hoursUntilSale <= (sale.address_unlock_hours || 24);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-pulse">
          <MapPin className="w-12 h-12 text-[#FF6F61]" />
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sale Not Found
          </h2>
          <Link to={createPageUrl('YardSales')}>
            <Button className="bg-[#FF6F61] hover:bg-[#e55a4d]">
              Browse All Sales
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const photos = sale.photos || [];

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to={createPageUrl('YardSales')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Sales
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
              {photos.length > 0 ? (
                <>
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-[4/3] cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img
                      src={photos[currentImageIndex]}
                      alt={sale.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Navigation Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? photos.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-[#2E3A59]" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === photos.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-[#2E3A59]" />
                      </button>
                    </>
                  )}
                  
                  {/* Dots */}
                  {photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {photos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-[#FF6F61]/10 to-[#F5A623]/10 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-[#FF6F61]/30" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {photos.map((photo, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-[#FF6F61]' : 'border-transparent'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Trust Badges & Category */}
            <div className="space-y-3">
              {sale.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6F61]/10 rounded-full text-sm font-medium text-[#FF6F61] capitalize">
                  <Tag className="w-3.5 h-3.5" />
                  {sale.category.replace('-', ' ')}
                </span>
              )}
              <TrustBadges seller={seller} />
            </div>

            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl font-bold text-[#2E3A59]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {sale.title}
            </h1>

            {/* Date & Time */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#FF6F61]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-[#2E3A59]">
                    {sale.date ? format(new Date(sale.date), 'EEEE, MMMM d, yyyy') : 'Date TBD'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-semibold text-[#2E3A59]">
                    {sale.start_time || '8:00 AM'} - {sale.end_time || '2:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-5 rounded-2xl shadow-sm">
              <AddressDisplay sale={sale} isAttending={isAttending} showIcon={true} />
            </div>

            {/* Description */}
            {sale.description && (
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-[#2E3A59] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  About This Sale
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{sale.description}</p>
              </div>
            )}

            {/* Seller Reputation */}
            <SellerReputation seller={seller} />

            {/* Safety Note */}
            <SafetyNote />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(46, 58, 89, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => attendanceMutation.mutate()}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold shadow-lg transition-all ${
                  isAttending
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-[#2E3A59] text-white hover:bg-[#1a2238]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <UserCheck className="w-5 h-5" />
                {isAttending ? "I'm Attending ✓" : "I'm Attending"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255, 111, 97, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetDirections}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => favoriteMutation.mutate()}
                className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all ${
                  isFavorite 
                    ? 'bg-[#FF6F61]/10 border-[#FF6F61] text-[#FF6F61]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#FF6F61] hover:text-[#FF6F61]'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border-2 border-gray-200 text-gray-400 hover:border-[#2E3A59] hover:text-[#2E3A59] transition-all"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Views */}
            {/* Views & Report */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">
                {sale.views || 0} people have viewed this sale
              </p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 
              className="text-2xl font-bold text-[#2E3A59] mb-6"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Reviews & Ratings
            </h2>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ReviewList 
                  reviews={reviews}
                  onHelpful={handleHelpful}
                  currentUserEmail={user?.email}
                />
              </div>

              <div className="lg:col-span-1">
                {user ? (
                  reviews.some(r => r.created_by === user.email) ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                      <p className="text-gray-600">You've already reviewed this sale</p>
                    </div>
                  ) : (
                    <ReviewForm 
                      onSubmit={(data) => reviewMutation.mutate(data)}
                      isSubmitting={reviewMutation.isPending}
                      type="sale"
                    />
                  )
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600 mb-4">Sign in to leave a review</p>
                    <Button
                      onClick={() => base44.auth.redirectToLogin()}
                      className="bg-[#FF6F61] hover:bg-[#e55a4d]"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.img
              key={currentImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={photos[currentImageIndex]}
              alt=""
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === 0 ? photos.length - 1 : prev - 1);
                  }}
                  className="absolute left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === photos.length - 1 ? 0 : prev + 1);
                  }}
                  className="absolute right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
        </AnimatePresence>

        {/* Report Modal */}
        <ReportModal
        sale={sale}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        />
        </div>
        );
        }