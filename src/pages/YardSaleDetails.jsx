import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  MapPin, Calendar, Clock, Heart, Share2, Navigation, 
  ChevronLeft, ChevronRight, X, ArrowLeft, Tag, UserCheck, Flag, Trash2, Edit,
  DollarSign, CreditCard, Smartphone, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users, MessageCircle, CalendarPlus, ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { toast } from "sonner";
import SEO from '../components/SEO';
import AddressDisplay from '../components/sales/AddressDisplay';
import TrustBadges from '../components/sales/TrustBadges';
import SellerReputation from '../components/sales/SellerReputation';
import ReportModal from '../components/sales/ReportModal';
import ShareModal from '../components/sales/ShareModal';
import SafetyNote from '../components/sales/SafetyNote';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import PrintableFlyer from '../components/sales/PrintableFlyer';
import MessageThread from '../components/messaging/MessageThread';
import { useTranslation } from '../components/translations';
import QRCodeDisplay from '../components/sales/QRCodeDisplay';
import ScanQRButton from '../components/sales/ScanQRButton';
import SaleAnalytics from '../components/sales/SaleAnalytics';

export default function YardSaleDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const saleId = urlParams.get('id');
  
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAttending, setIsAttending] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [seller, setSeller] = useState(null);
  const [language, setLanguage] = useState('en');
  const [translatedDescription, setTranslatedDescription] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const t = useTranslation(language);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
      setTranslatedDescription(null); // Reset translation on language change
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    if (saleId) {
      base44.analytics.track({
        eventName: 'sale_details_viewed',
        properties: { sale_id: saleId }
      });
    }
  }, [saleId]);

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

  const { data: sale, isLoading, error: saleError } = useQuery({
    queryKey: ['yardSale', saleId],
    queryFn: async () => {
      console.log('🔍 Fetching sale with ID:', saleId);
      console.log('🔍 ID type:', typeof saleId, 'value:', saleId);
      if (!saleId) {
        console.error('❌ No sale ID provided');
        return null;
      }
      
      try {
        // Try filtering by ID
        let sales = await base44.entities.YardSale.filter({ id: saleId });
        console.log('📦 Filter by id found sales:', sales.length, sales);
        
        // If not found, try listing all and finding by ID (backup)
        if (sales.length === 0) {
          console.log('🔄 Trying backup method - listing all sales...');
          const allSales = await base44.entities.YardSale.list();
          console.log('📦 Total sales in DB:', allSales.length);
          sales = allSales.filter(s => s.id === saleId);
          console.log('📦 Found after manual filter:', sales.length);
        }
        
        if (sales.length > 0) {
          console.log('✅ Found sale:', sales[0].title);
          // Increment views (silently fail if no permission)
          try {
            await base44.entities.YardSale.update(saleId, { views: (sales[0].views || 0) + 1 });
          } catch (err) {
            console.log('Could not increment views (permission denied - user not sale creator)');
          }
          
          // Fetch seller info via backend function
          const sellerEmail = sales[0].created_by;
          const sellerUserId = sales[0].created_by_id;
          if (sellerEmail || sellerUserId) {
            try {
              const payload = sellerEmail ? { email: sellerEmail } : { id: sellerUserId };
              const { data } = await base44.functions.invoke('getSellerInfo', payload);
              if (data?.seller) {
                setSeller(data.seller);
              }
            } catch (err) {
              console.error('❌ Failed to fetch seller info:', err);
            }
          }
          
          return sales[0];
        }
        console.warn('⚠️ No sale found with ID:', saleId);
        return null;
      } catch (error) {
        console.error('❌ Error fetching sale:', error);
        console.error('❌ Error details:', error.message, error.stack);
        throw error;
      }
    },
    enabled: !!saleId,
    retry: 1,
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

  const { data: sellerReviews = [] } = useQuery({
    queryKey: ['sellerReviews', seller?.email],
    queryFn: async () => {
      if (!seller?.email) return [];
      // Get all sales by this seller
      const sellerSales = await base44.entities.YardSale.filter({ created_by: seller.email });
      const saleIds = sellerSales.map(s => s.id);
      
      // Get all reviews for seller's sales
      const allReviews = await base44.entities.YardSaleReview.list();
      return allReviews.filter(r => saleIds.includes(r.yard_sale_id));
    },
    enabled: !!seller?.email,
  });

  const { data: attendanceCount = 0 } = useQuery({
    queryKey: ['attendanceCount', saleId],
    queryFn: async () => {
      if (!saleId || !user || sale?.created_by !== user?.email) return 0;
      const all = await base44.entities.Attendance.filter({ yard_sale_id: saleId });
      return all.length;
    },
    enabled: !!saleId && !!user && !!sale && sale?.created_by === user?.email,
  });

  const { data: sellerSalesCount = 0 } = useQuery({
    queryKey: ['sellerSalesCount', seller?.email],
    queryFn: async () => {
      if (!seller?.email) return 0;
      const sales = await base44.entities.YardSale.filter({ created_by: seller.email, status: 'approved' });
      return sales.length;
    },
    enabled: !!seller?.email,
  });

  const sellerAverageRating = sellerReviews.length > 0 
    ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length 
    : null;

  // Translate description when language is Spanish
  useEffect(() => {
    const translateDescription = async () => {
      if (language === 'es' && sale?.description && !translatedDescription && !isTranslating) {
        setIsTranslating(true);
        try {
          const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Translate the following yard sale description to Spanish. Only return the translation, nothing else:\n\n${sale.description}`,
            add_context_from_internet: false
          });
          setTranslatedDescription(response);
        } catch (error) {
          console.error('Translation failed:', error);
        } finally {
          setIsTranslating(false);
        }
      }
    };

    translateDescription();
  }, [language, sale?.description, translatedDescription, isTranslating]);

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

      base44.analytics.track({
        eventName: isFavorite ? 'sale_unfavorited' : 'favorite_added',
        properties: { sale_id: saleId }
      });
      
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
      toast.success(isFavorite ? t('removedFromFavorites') : t('addedToFavorites'));
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        base44.auth.redirectToLogin();
        throw new Error('not_authenticated');
      }

      // If removing attendance, skip geo check
      if (isAttending) {
        const existing = attendances[0];
        if (existing) {
          await base44.entities.Attendance.delete(existing.id);
        }
        base44.analytics.track({ eventName: 'attendance_removed', properties: { sale_id: saleId } });
        return;
      }

      await base44.entities.Attendance.create({ 
        yard_sale_id: saleId, 
        user_email: user.email,
        notify_reminder: true
      });
      base44.analytics.track({ eventName: 'attendance_marked', properties: { sale_id: saleId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(isAttending ? 'No longer attending' : '🎉 Attending! Exact address unlocked.');
    },
    onError: (error) => {
      if (error?.message === 'not_authenticated') return;
      toast.error('Something went wrong. Please try again.');
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ rating, comment }) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      
      // Check if user marked as attending
      if (!isAttending && attendances.length === 0) {
        toast.error('You must mark yourself as attending to leave a review');
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
      
      // Verify location if sale is currently happening or just finished
      const saleDateTime = new Date(`${sale.date}T${sale.start_time || '08:00'}`);
      const saleEndTime = new Date(`${sale.date}T${sale.end_time || '14:00'}`);
      const now = new Date();
      
      await base44.entities.YardSaleReview.create({
        yard_sale_id: saleId,
        user_email: user.email,
        rating,
        comment,
        attended: true
      });

      base44.analytics.track({
        eventName: 'review_submitted',
        properties: { sale_id: saleId, rating }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review submitted!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.YardSale.delete(saleId);
    },
    onSuccess: () => {
      toast.success('Sale deleted successfully');
      navigate(createPageUrl('YardSales'));
    },
    onError: () => {
      toast.error('Failed to delete sale');
    },
  });

  const handleDelete = () => {
    // Check if sale is more than 2 hours away
    if (sale?.date && sale?.start_time) {
      const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
      const now = new Date();
      const hoursUntilSale = (saleDateTime - now) / (1000 * 60 * 60);
      
      if (hoursUntilSale < 2) {
        toast.error('Cannot delete sale within 2 hours of start time');
        return;
      }
    }
    
    if (window.confirm(t('confirmDelete'))) {
      deleteMutation.mutate();
    }
  };
  
  const canDeleteSale = () => {
    if (!sale?.date || !sale?.start_time) return true;
    const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
    const now = new Date();
    const hoursUntilSale = (saleDateTime - now) / (1000 * 60 * 60);
    return hoursUntilSale >= 2;
  };

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

  const handleShare = () => {
    base44.analytics.track({
      eventName: 'sale_shared',
      properties: { sale_id: saleId }
    });
    setIsShareModalOpen(true);
  };

  const handleGetDirections = () => {
    base44.analytics.track({
      eventName: 'directions_clicked',
      properties: { sale_id: saleId }
    });
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

  const handleAddToCalendar = (type) => {
    const title = encodeURIComponent(sale.title);
    const location = encodeURIComponent(`${sale.general_location || ''}, ${sale.city}, ${sale.state}`);
    const details = encodeURIComponent(sale.description || `Yard sale on Stooplify: ${window.location.href}`);
    const startTime = parseTimeTo24h(sale.start_time).replace(/:/g, '').slice(0, 4);
    const endTime = parseTimeTo24h(sale.end_time).replace(/:/g, '').slice(0, 4);
    const dateStr = sale.date ? sale.date.replace(/-/g, '') : '';
    const startDT = `${dateStr}T${startTime}00`;
    const endDT = `${dateStr}T${endTime}00`;

    if (type === 'google') {
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDT}/${endDT}&details=${details}&location=${location}`;
      window.open(url, '_blank');
    } else if (type === 'ical' || type === 'outlook') {
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${startDT}`,
        `DTEND:${endDT}`,
        `SUMMARY:${decodeURIComponent(title)}`,
        `DESCRIPTION:${decodeURIComponent(details)}`,
        `LOCATION:${decodeURIComponent(location)}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sale.title.replace(/\s+/g, '_')}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }
    base44.analytics.track({ eventName: 'add_to_calendar', properties: { sale_id: saleId, calendar_type: type } });
  };

  const isAddressUnlocked = () => {
    if (!sale?.date) return false;
    const saleDate = new Date(sale.date).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  };

  const isExactLocationVisible = () => {
    if (!sale?.date) return false;
    const saleDate = new Date(sale.date).toDateString();
    const today = new Date().toDateString();
    return saleDate === today || isAttending;
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
            {t('saleNotFound')}
          </h2>
          <Link to={createPageUrl('YardSales')}>
            <Button className="bg-[#FF6F61] hover:bg-[#e55a4d]">
              {t('browseAllSales')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const photos = sale.photos || [];

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : null;

  const parseTimeTo24h = (timeStr) => {
    if (!timeStr) return '09:00:00';
    const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!m) return '09:00:00';
    let h = parseInt(m[1]);
    const min = m[2];
    const period = m[3]?.toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}:00`;
  };

  const saleEventStatus = (() => {
    const now = new Date();
    const saleEnd = new Date(`${sale.date}T${parseTimeTo24h(sale.end_time)}`);
    return now > saleEnd ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled";
  })();

  const defaultImage = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/ada49740a_Stooplify-01.png";
  const organizerInfo = seller?.full_name
    ? { "@type": "Person", "name": seller.full_name }
    : { "@type": "Organization", "name": "Stooplify", "url": "https://stooplify.com" };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": sale.title,
    "startDate": `${sale.date}T${parseTimeTo24h(sale.start_time)}-05:00`,
    "endDate": `${sale.date}T${parseTimeTo24h(sale.end_time)}-05:00`,
    "eventStatus": saleEventStatus,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "image": photos.length > 0 ? photos : [defaultImage],
    "location": {
      "@type": "Place",
      "name": sale.general_location || `${sale.city}, ${sale.state}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": sale.city || "Brooklyn",
        "addressRegion": sale.state || "NY",
        "addressCountry": "US",
        ...(sale.zip_code ? { "postalCode": sale.zip_code } : {})
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": window.location.href
    },
    "organizer": organizerInfo,
    "performer": {
      "@type": "Organization",
      "name": "Local Yard Sale Hosts"
    },
    ...(sale.description ? { "description": sale.description } : {}),
    ...(averageRating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "reviewCount": reviews.length
      }
    } : {})
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] overflow-x-hidden">
      <SEO 
        title={`${sale.title} - Yard Sale | Stooplify`}
        description={sale.description || `${sale.title} happening on ${format(new Date(sale.date), 'MMMM d, yyyy')} in ${sale.city}, ${sale.state}. Find details and get directions.`}
        keywords={`${sale.title}, yard sale ${sale.city}, ${sale.category} sale, ${sale.city} ${sale.state} yard sale`}
        image={photos[0]}
        url={`https://stooplify.com/YardSaleDetails?id=${saleId}`}
        canonical={`https://stooplify.com/YardSaleDetails?id=${saleId}`}
        type="event"
        structuredData={structuredData}
      />
      {/* Host Edit Banner */}
      {user && sale && user.email === sale.created_by && (
        <div className="bg-[#2E3A59] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Edit className="w-4 h-4 text-[#14B8FF] flex-shrink-0" />
              <span className="font-medium">You're viewing your own listing</span>
            </div>
            <Link to={createPageUrl('AddYardSale') + `?edit=${saleId}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#14B8FF] text-white rounded-full text-sm font-semibold hover:bg-[#0da3e6] transition-colors whitespace-nowrap"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Listing
              </motion.button>
            </Link>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to={createPageUrl('YardSales')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToSales')}
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 w-full min-w-0">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0 w-full"
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
            className="space-y-6 min-w-0 w-full"
          >
            {/* Trust Badges & Categories */}
            <div className="space-y-3">
              {(sale.categories || (sale.category ? [sale.category] : [])).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(sale.categories || [sale.category]).map((cat, idx) => {
                    const categoryIcons = {
                      general: Package, furniture: Sofa, clothing: Shirt, electronics: Zap,
                      toys: Baby, antiques: Crown, books: BookOpen, sports: Dumbbell, 'multi-family': Users
                    };
                    const Icon = categoryIcons[cat] || Tag;
                    return (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6F61]/10 rounded-full text-sm font-medium text-[#FF6F61] capitalize">
                        <Icon className="w-3.5 h-3.5" />
                        {cat.replace('-', ' ')}
                      </span>
                    );
                  })}
                </div>
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
                  <p className="text-xs text-gray-500">{t('date')}</p>
                  <p className="font-semibold text-[#2E3A59]">
                    {sale.date ? format(new Date(sale.date), 'EEEE, MMMM d, yyyy') : t('dateTBD')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-[#F5A623]/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('time')}</p>
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

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => attendanceMutation.mutate()}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all ${
                  isAttending
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-[#2E3A59] text-white hover:bg-[#1a2238]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                {isAttending ? '✓ Attending' : "I'm Attending"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetDirections}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FF6F61] text-white rounded-lg font-semibold text-sm shadow-md"
              >
                <Navigation className="w-4 h-4" />
                Directions
              </motion.button>

              {sale.created_by !== user?.email && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!user) {
                      base44.auth.redirectToLogin();
                      return;
                    }
                    const msgSection = document.getElementById('message-section');
                    if (msgSection) {
                      msgSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#14B8FF] text-white rounded-lg font-semibold text-sm shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => favoriteMutation.mutate()}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all ${
                  isFavorite 
                    ? 'bg-[#FF6F61]/10 border-[#FF6F61] text-[#FF6F61]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#FF6F61] hover:text-[#FF6F61]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border-2 border-gray-200 text-gray-400 hover:border-[#2E3A59] hover:text-[#2E3A59] transition-all"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-1 px-4 py-2 bg-white border-2 border-gray-200 text-gray-600 rounded-lg font-medium hover:border-[#FF6F61] hover:text-[#FF6F61] transition-all"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleAddToCalendar('google')} className="cursor-pointer gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M21.8 10.2H12v3.6h5.6c-.5 2.5-2.7 4.2-5.6 4.2-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5l2.7-2.7C17.1 3.2 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 9.7-4 9.7-9.7 0-.7-.1-1.4-.2-2.1h-.7z" fill="#4285F4"/>
                    </svg>
                    Google
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddToCalendar('ical')} className="cursor-pointer gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Apple
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddToCalendar('outlook')} className="cursor-pointer gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#0078D4">
                      <path d="M7 2H3a1 1 0 00-1 1v18a1 1 0 001 1h18a1 1 0 001-1V8l-6-6H7zm11 17H6V11h12v8zM13 3.5L18.5 9H13V3.5z"/>
                    </svg>
                    Outlook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Map */}
            {(sale.latitude && sale.longitude) && (
              <div className="bg-white p-5 rounded-2xl shadow-sm relative z-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {t('locationMap')}
                  </h3>
                  {!isExactLocationVisible() && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {t('approximateArea')}
                    </span>
                  )}
                </div>
                <div className="h-64 rounded-xl overflow-hidden">
                  <MapContainer
                    center={[
                      isExactLocationVisible() ? (sale.exact_latitude || sale.latitude) : sale.latitude,
                      isExactLocationVisible() ? (sale.exact_longitude || sale.longitude) : sale.longitude
                    ]}
                    zoom={isExactLocationVisible() ? 16 : 14}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      maxZoom={20}
                    />
                    {isExactLocationVisible() ? (
                      <Marker position={[sale.exact_latitude || sale.latitude, sale.exact_longitude || sale.longitude]}>
                        <Popup>{sale.title}</Popup>
                      </Marker>
                    ) : (
                      <Circle
                        center={[sale.latitude, sale.longitude]}
                        radius={500}
                        pathOptions={{ color: '#FF6F61', fillColor: '#FF6F61', fillOpacity: 0.2 }}
                      />
                    )}
                  </MapContainer>
                </div>
                {!isExactLocationVisible() && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {t('exactLocationNote')}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            {sale.description && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('aboutThisSale')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {language === 'es' && translatedDescription ? translatedDescription : sale.description}
                  {language === 'es' && isTranslating && !translatedDescription && (
                    <span className="text-gray-400 italic"> (Traduciendo...)</span>
                  )}
                </p>
              </div>
            )}

            {/* Payment Methods */}
            {(sale.payment_cash || sale.payment_card || sale.payment_digital) && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-[#2E3A59] dark:text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Payment Options
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sale.payment_cash && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                      sale.cash_preferred 
                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
                        : 'bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Cash {sale.cash_preferred && '(Preferred)'}
                      </span>
                    </div>
                  )}
                  {sale.payment_card && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Credit/Debit</span>
                    </div>
                  )}
                  {sale.payment_digital && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">Digital Payments</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seller Info & Message */}
            {(sale.created_by || sale.created_by_id) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-[#14B8FF]">
                <h3 className="font-semibold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Hosted By
                </h3>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {(seller?.full_name || seller?.email || sale.created_by || 'H')[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#2E3A59] dark:text-white capitalize">
                        {seller?.full_name || (sale.created_by ? sale.created_by.split('@')[0] : 'Local Host')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {sellerSalesCount > 0 ? `${sellerSalesCount} ${sellerSalesCount === 1 ? 'sale' : 'sales'} hosted` : 'Stooplify seller'}
                        {sellerAverageRating && ` • ⭐ ${sellerAverageRating.toFixed(1)} rating`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <SellerReputation 
                  seller={seller} 
                  averageRating={sellerAverageRating}
                  totalReviews={sellerReviews.length}
                  totalSales={sellerSalesCount}
                />
                
                {sale.created_by !== user?.email && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!user) {
                        base44.auth.redirectToLogin();
                        return;
                      }
                      base44.analytics.track({ eventName: 'seller_contacted', properties: { sale_id: saleId } });
                      const msgSection = document.getElementById('message-section');
                      if (msgSection) {
                        msgSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#14B8FF] text-white rounded-xl font-semibold hover:bg-[#0da3e6] transition-colors shadow-md mt-4"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message Host via Stooplify
                  </motion.button>
                )}
              </div>
            )}

            {/* Safety Note */}
            <SafetyNote />

            {/* Seller Actions (Edit/Delete) */}
            {user && sale.created_by === user.email && (
              <div className="space-y-3">
              {attendanceCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700 dark:text-green-400">
                    {attendanceCount} {attendanceCount === 1 ? 'person is' : 'people are'} attending your sale!
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <Link to={createPageUrl('AddYardSale') + `?edit=${saleId}`} className="flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {t('editSale')}
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: canDeleteSale() ? 1.02 : 1 }}
                  whileTap={{ scale: canDeleteSale() ? 0.98 : 1 }}
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending || !canDeleteSale()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!canDeleteSale() ? t('cannotDeleteWithin2Hours') : ''}
                >
                  <Trash2 className="w-4 h-4" />
                  {t('deleteSale')}
                </motion.button>
              </div>
              </div>
            )}



            {/* Social Share Strip */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Share this sale</p>
              <div className="flex gap-2 flex-wrap">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877F2] hover:bg-[#0e64d1] text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Facebook</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this yard sale: ${sale.title}`)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>X</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out this yard sale: ${sale.title} ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>WhatsApp</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] hover:opacity-90 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.02c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.332-2.96-.924c-.644-.203-.658-.644.135-.954l11.56-4.457c.54-.203 1.01.122.84.957z"/></svg>
                  <span>Instagram</span>
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this yard sale: ${sale.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.02c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.332-2.96-.924c-.644-.203-.658-.644.135-.954l11.56-4.457c.54-.203 1.01.122.84.957z"/></svg>
                  <span>Telegram</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied! Open TikTok and paste in your video description');
                  }}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  <span>TikTok</span>
                </motion.button>
              </div>
            </div>

            {/* Views & Report */}
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-500">
                {sale.views || 0} {t('peopleViewed')}
              </p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Flag className="w-4 h-4" />
                {t('report')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* QR Code Section - Seller sees their QR code, buyer sees scan button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {user && sale.created_by === user.email ? (
            <QRCodeDisplay
              saleId={saleId}
              saleTitle={sale.title}
              saleAddress={[sale.address, sale.city, sale.state].filter(Boolean).join(', ')}
            />
          ) : user && sale.created_by !== user.email ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                📱 Are you at this sale?
              </h3>
              <ScanQRButton saleId={saleId} sale={sale} user={user} />
            </div>
          ) : null}
        </div>

        {/* Analytics Section — host only */}
        {user && sale.created_by === user.email && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <SaleAnalytics sale={sale} saleId={saleId} />
          </div>
        )}

        {/* Printable Flyer Section */}
        {user && sale.created_by === user.email && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <AccordionItem value="flyer" className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 
                      className="text-xl font-bold text-[#2E3A59] dark:text-white"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      Printable Flyer
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <PrintableFlyer sale={sale} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        )}

        {/* Message Section */}
        {(sale.created_by || sale.created_by_id) && user && sale.created_by !== user.email && (
          <div id="message-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MessageThread yardSale={sale} seller={seller || { email: sale.created_by }} />
            </motion.div>
          </div>
        )}

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
              {t('reviewsAndRatings')}
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
                      <p className="text-gray-600">{t('youAlreadyReviewed')}</p>
                    </div>
                  ) : !isAttending && attendances.length === 0 ? (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
                      <p className="text-gray-600 mb-4">{t('markAttendingToReview')}</p>
                      <Button
                        onClick={() => attendanceMutation.mutate()}
                        className="bg-[#2E3A59] hover:bg-[#1a2238]"
                      >
                        {t('imAttending')}
                      </Button>
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
                    <p className="text-gray-600 mb-4">{t('signInToReview')}</p>
                    <Button
                      onClick={() => base44.auth.redirectToLogin()}
                      className="bg-[#FF6F61] hover:bg-[#e55a4d]"
                    >
                      {t('signIn')}
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

        {/* Share Modal */}
        <ShareModal
          sale={sale}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
    </div>
  );
}