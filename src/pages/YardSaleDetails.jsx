import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  MapPin, ArrowLeft, Tag, Flag, Trash2, Edit,
  Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import SaleGallery from '../components/sales/details/SaleGallery';
import SaleDateTimeCards from '../components/sales/details/SaleDateTimeCards';
import SaleActionBar from '../components/sales/details/SaleActionBar';
import SaleLocationMap from '../components/sales/details/SaleLocationMap';
import SalePaymentOptions from '../components/sales/details/SalePaymentOptions';
import SaleHostCard from '../components/sales/details/SaleHostCard';
import SaleShareStrip from '../components/sales/details/SaleShareStrip';
import SaleReviewsSection from '../components/sales/details/SaleReviewsSection';
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
          // Increment views via backend (service role — works for anonymous and non-owner viewers)
          base44.functions.invoke('incrementSaleViews', { saleId }).catch(() => {});
          
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <MapPin className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
            {t('saleNotFound')}
          </h2>
          <Link to={createPageUrl('YardSales')}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
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

  const isOwner = !!user && sale.created_by === user.email;
  const scrollToMessages = (trackContact = false) => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    if (trackContact) base44.analytics.track({ eventName: 'seller_contacted', properties: { sale_id: saleId } });
    document.getElementById('message-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  const categoryIcons = { general: Package, furniture: Sofa, clothing: Shirt, electronics: Zap, toys: Baby, antiques: Crown, books: BookOpen, sports: Dumbbell, 'multi-family': Users };
  const categories = sale.categories || (sale.category ? [sale.category] : []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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
      {isOwner && (
        <div className="bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Edit className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">You're viewing your own listing</span>
            </div>
            <Link to={createPageUrl('AddYardSale') + `?edit=${saleId}`}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
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
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {t('backToSales')}
          </motion.button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 w-full min-w-0">
          <SaleGallery photos={photos} title={sale.title} />

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 min-w-0 w-full">
            <div className="space-y-3">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => {
                    const Icon = categoryIcons[cat] || Tag;
                    return (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-semibold uppercase tracking-wide text-primary">
                        <Icon className="w-3.5 h-3.5" />
                        {cat.replace('-', ' ')}
                      </span>
                    );
                  })}
                </div>
              )}
              <TrustBadges seller={seller} />
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
              {sale.title}
            </h1>

            <SaleDateTimeCards sale={sale} t={t} />

            <div className="bg-card border border-border p-5 rounded-2xl shadow-card">
              <AddressDisplay sale={sale} isAttending={isAttending} showIcon={true} />
            </div>

            <SaleActionBar
              isAttending={isAttending}
              onToggleAttend={() => attendanceMutation.mutate()}
              onDirections={handleGetDirections}
              showChat={!isOwner}
              onChat={() => scrollToMessages(false)}
              isFavorite={isFavorite}
              onToggleFavorite={() => favoriteMutation.mutate()}
              onShare={handleShare}
              onAddToCalendar={handleAddToCalendar}
            />

            <SaleLocationMap sale={sale} exactVisible={isExactLocationVisible()} t={t} />

            {sale.description && (
              <div className="bg-card border border-border p-5 rounded-2xl shadow-card">
                <h3 className="font-heading font-semibold text-foreground mb-3">{t('aboutThisSale')}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {language === 'es' && translatedDescription ? translatedDescription : sale.description}
                  {language === 'es' && isTranslating && !translatedDescription && (
                    <span className="italic opacity-70"> (Traduciendo...)</span>
                  )}
                </p>
              </div>
            )}

            <SalePaymentOptions sale={sale} />

            <SaleHostCard
              sale={sale}
              seller={seller}
              sellerSalesCount={sellerSalesCount}
              sellerAverageRating={sellerAverageRating}
              sellerReviewsCount={sellerReviews.length}
              isOwner={isOwner}
              onMessage={() => scrollToMessages(true)}
            />

            <SafetyNote />

            {isOwner && (
              <div className="space-y-3">
                {attendanceCount > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {attendanceCount} {attendanceCount === 1 ? 'person is' : 'people are'} attending your sale!
                    </span>
                  </div>
                )}
                <div className="flex gap-3">
                  <Link to={createPageUrl('AddYardSale') + `?edit=${saleId}`} className="flex-1">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/70 transition-colors">
                      <Edit className="w-4 h-4" />
                      {t('editSale')}
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: canDeleteSale() ? 1.02 : 1 }}
                    whileTap={{ scale: canDeleteSale() ? 0.98 : 1 }}
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending || !canDeleteSale()}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-xl font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!canDeleteSale() ? t('cannotDeleteWithin2Hours') : ''}>
                    <Trash2 className="w-4 h-4" />
                    {t('deleteSale')}
                  </motion.button>
                </div>
              </div>
            )}

            <SaleShareStrip sale={sale} />

            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">{sale.views || 0} {t('peopleViewed')}</p>
              <button onClick={() => setIsReportModalOpen(true)} className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                <Flag className="w-4 h-4" />
                {t('report')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* QR Code Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {isOwner ? (
            <QRCodeDisplay saleId={saleId} saleTitle={sale.title} saleAddress={[sale.address, sale.city, sale.state].filter(Boolean).join(', ')} />
          ) : user ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="font-heading font-semibold text-foreground mb-4">📱 Are you at this sale?</h3>
              <ScanQRButton saleId={saleId} sale={sale} user={user} />
            </div>
          ) : null}
        </div>

        {isOwner && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <SaleAnalytics sale={sale} saleId={saleId} />
          </div>
        )}

        {isOwner && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Accordion type="single" collapsible className="bg-card border border-border rounded-2xl shadow-card">
                <AccordionItem value="flyer" className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="font-heading text-xl font-bold text-foreground">Printable Flyer</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <PrintableFlyer sale={sale} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        )}

        {(sale.created_by || sale.created_by_id) && user && !isOwner && (
          <div id="message-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <MessageThread yardSale={sale} seller={seller || { email: sale.created_by }} />
            </motion.div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-12">
          <SaleReviewsSection
            reviews={reviews}
            user={user}
            canReview={isAttending || attendances.length > 0}
            onHelpful={handleHelpful}
            onAttend={() => attendanceMutation.mutate()}
            onSubmit={(data) => reviewMutation.mutate(data)}
            isSubmitting={reviewMutation.isPending}
            t={t}
          />
        </div>
      </div>

      <ReportModal sale={sale} isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      <ShareModal sale={sale} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
}