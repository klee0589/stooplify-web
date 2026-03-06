import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List, Loader2, MapPin, Calendar, Tag, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SEO from '../components/SEO';
import SaleCard from '../components/sales/SaleCard';
import SaleFilters from '../components/sales/SaleFilters';
import SaleMap from '../components/sales/SaleMap';
import MobileDiscovery from '../components/sales/MobileDiscovery';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isWithinInterval } from 'date-fns';
import PullToRefresh from '../components/PullToRefresh';
import { Link } from 'react-router-dom';

const CITY_PAGES = [
  { label: 'Brooklyn', url: '/stoop-sales-brooklyn', emoji: '🏙️' },
  { label: 'Queens', url: '/stoop-sales-queens', emoji: '🌆' },
  { label: 'Manhattan', url: '/stoop-sales-manhattan', emoji: '🗽' },
  { label: 'Bronx', url: '/stoop-sales-bronx', emoji: '🏘️' },
  { label: 'Jersey City', url: '/stoop-sales-jersey-city', emoji: '🌉' },
  { label: 'Los Angeles', url: '/garage-sales-los-angeles', emoji: '☀️' },
  { label: 'San Francisco', url: '/garage-sales-san-francisco', emoji: '🌁' },
];

const NEIGHBORHOOD_PAGES = [
  { label: 'Williamsburg', url: '/stoop-sales-williamsburg-brooklyn' },
  { label: 'Park Slope', url: '/stoop-sales-park-slope-brooklyn' },
  { label: 'Bushwick', url: '/stoop-sales-bushwick-brooklyn' },
  { label: 'Bed-Stuy', url: '/stoop-sales-bed-stuy-brooklyn' },
  { label: 'Crown Heights', url: '/stoop-sales-crown-heights-brooklyn' },
  { label: 'Greenpoint', url: '/stoop-sales-greenpoint-brooklyn' },
  { label: 'Astoria', url: '/stoop-sales-astoria-queens' },
  { label: 'Upper West Side', url: '/stoop-sales-upper-west-side-manhattan' },
  { label: 'Harlem', url: '/stoop-sales-harlem-manhattan' },
];

const DATE_PAGES = [
  { label: 'Today', url: '/yard-sales-near-me-today' },
  { label: 'This Saturday', url: '/yard-sales-near-me-saturday' },
  { label: 'This Sunday', url: '/yard-sales-near-me-sunday' },
  { label: 'This Weekend', url: '/yard-sales-near-me-this-weekend' },
  { label: 'NYC Today', url: '/stoop-sales-nyc-today' },
  { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

const CATEGORY_PAGES = [
  { label: 'Furniture', url: '/furniture-yard-sales', emoji: '🛋️' },
  { label: 'Vintage Clothing', url: '/vintage-clothing-stoop-sales', emoji: '👗' },
  { label: 'Books', url: '/book-sales', emoji: '📚' },
  { label: 'Electronics', url: '/electronics-yard-sales', emoji: '💻' },
  { label: 'Antiques', url: '/antique-yard-sales', emoji: '🏺' },
  { label: 'Toys', url: '/toy-yard-sales', emoji: '🧸' },
];

export default function YardSales() {
  const [viewMode, setViewMode] = useState('map');
  const [filters, setFilters] = useState({ categories: [], date: 'all', distance: 'all', payment: 'all', search: '' });
  const [showEndedSales, setShowEndedSales] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [visibleMapSales, setVisibleMapSales] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  const t = useTranslation(language);

  const queryClient = useQueryClient();

  useEffect(() => {
    // Track page view
    base44.analytics.track({
      eventName: 'yard_sales_page_viewed',
      properties: { view_mode: viewMode }
    });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch (e) {
        // User not authenticated, but that's okay - page is public
      }
    };
    checkAuth();

    // Get user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationLoaded(true);
        },
        () => setLocationLoaded(true) // fail silently but mark as done
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  const { data: sales = [], isLoading, refetch, error } = useQuery({
    queryKey: ['yardSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 100);
      const now = new Date();
      return allSales.map((sale) => {
        const endStr = sale.end_time || '23:59';
        const saleEnd = new Date(`${sale.date}T${endStr.includes(':') ? endStr : '23:59'}`);
        return { ...sale, isPast: saleEnd < now };
      });
    },
  });

  // Helper: distance in miles between two lat/lng points
  const getDistanceMiles = (lat1, lng1, lat2, lng2) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const { data: userFavorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Favorite.filter({ user_email: user.email });
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userFavorites.length > 0) {
      setFavorites(userFavorites.map(f => f.yard_sale_id));
    }
  }, [userFavorites]);

  const { data: userAttendances = [] } = useQuery({
    queryKey: ['attendances', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Attendance.filter({ user_email: user.email });
    },
    enabled: !!user,
  });

  const attendingSaleIds = new Set(userAttendances.map(a => a.yard_sale_id));

  const favoriteMutation = useMutation({
    mutationFn: async (saleId) => {
      if (!user) {
        base44.auth.redirectToLogin();
        return;
      }
      
      const existing = userFavorites.find(f => f.yard_sale_id === saleId);
      if (existing) {
        await base44.entities.Favorite.delete(existing.id);
      } else {
        await base44.entities.Favorite.create({ yard_sale_id: saleId, user_email: user.email });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleToggleFavorite = (saleId) => {
    const isFavorited = favorites.includes(saleId);
    base44.analytics.track({
      eventName: isFavorited ? 'sale_unfavorited' : 'sale_favorited',
      properties: { sale_id: saleId }
    });
    // Optimistic update
    setFavorites(prev => isFavorited ? prev.filter(id => id !== saleId) : [...prev, saleId]);
    favoriteMutation.mutate(saleId);
  };

  // In list mode, only show sales within 25 miles OR that the user is attending/favorited
  const isNearbyOrEngaged = (sale) => {
    const isFavorited = favorites.includes(sale.id);
    const isAttending = attendingSaleIds.has(sale.id);
    if (isFavorited || isAttending) return true;
    if (!locationLoaded) return false; // Wait until we know location status

    if (userLocation) {
      if (!sale.latitude || !sale.longitude) return false;
      return getDistanceMiles(userLocation.lat, userLocation.lng, sale.latitude, sale.longitude) <= 25;
    }
    // Location denied/unavailable — show all sales (can't filter by distance)
    return true;
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    // Hide ended sales by default
    if (!showEndedSales && sale.isPast) {
      return false;
    }

    // In list mode: only show nearby or engaged sales
    if (viewMode === 'list' && !isNearbyOrEngaged(sale)) {
      return false;
    }
    
    // Search (title, description, and location fields)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = sale.title?.toLowerCase().includes(searchLower);
      const descMatch = sale.description?.toLowerCase().includes(searchLower);
      const generalLocationMatch = sale.general_location?.toLowerCase().includes(searchLower);
      const addressMatch = sale.address?.toLowerCase().includes(searchLower);
      const cityMatch = sale.city?.toLowerCase().includes(searchLower);
      const stateMatch = sale.state?.toLowerCase().includes(searchLower);
      const zipCodeMatch = sale.zip_code?.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !descMatch && !generalLocationMatch && !addressMatch && !cityMatch && !stateMatch && !zipCodeMatch) {
        return false;
      }
    }
    
    // Categories
    if (filters.categories.length > 0) {
      const saleCategories = sale.categories || (sale.category ? [sale.category] : []);
      if (!filters.categories.some(cat => saleCategories.includes(cat))) {
        return false;
      }
    }
    
    // Date filtering
    if (filters.date !== 'all' && sale.date) {
      const saleDate = new Date(sale.date);
      const today = new Date();
      
      switch (filters.date) {
        case 'today':
          if (!isWithinInterval(saleDate, { start: startOfDay(today), end: endOfDay(today) })) {
            return false;
          }
          break;
        case 'tomorrow':
          const tomorrow = addDays(today, 1);
          if (!isWithinInterval(saleDate, { start: startOfDay(tomorrow), end: endOfDay(tomorrow) })) {
            return false;
          }
          break;
        case 'weekend':
          const weekEnd = endOfWeek(today);
          const friday = addDays(startOfWeek(today), 5);
          if (!isWithinInterval(saleDate, { start: friday, end: weekEnd })) {
            return false;
          }
          break;
        case 'week':
          if (!isWithinInterval(saleDate, { start: startOfWeek(today), end: endOfWeek(today) })) {
            return false;
          }
          break;
      }
    }
    
    // Payment filtering
    if (filters.payment !== 'all') {
      if (filters.payment === 'cash' && !sale.payment_cash) return false;
      if (filters.payment === 'card' && !sale.payment_card) return false;
      if (filters.payment === 'digital' && !sale.payment_digital) return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    base44.analytics.track({ eventName: 'filters_reset' });
    setFilters({ categories: [], date: 'all', distance: 'all', payment: 'all', search: '' });
  };

  // Track filter changes
  useEffect(() => {
    if (filters.categories.length > 0 || filters.date !== 'all' || filters.payment !== 'all' || filters.search) {
      base44.analytics.track({
        eventName: 'sales_filtered',
        properties: {
          categories: filters.categories,
          date: filters.date,
          payment: filters.payment,
          has_search: !!filters.search
        }
      });
    }
  }, [filters]);

  // Track view mode changes
  useEffect(() => {
    base44.analytics.track({
      eventName: 'view_mode_changed',
      properties: { view_mode: viewMode }
    });
  }, [viewMode]);

  // Convert "9:00 AM" or "14:00" to "HH:MM:SS" 24h format
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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": filteredSales.slice(0, 10).filter(sale => sale.date).map((sale) => {
      const primaryImage = sale.photos?.[0] || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/5937bd15f_s-2426613-s9fq3f3gayb673oi-t.jpg";
      const eventStatus = sale.isPast
        ? "https://schema.org/EventCompleted"
        : "https://schema.org/EventScheduled";
      const saleSlug = sale.id;
      const organizerName = sale.seller?.full_name || null;

      return {
        "@type": "Event",
        "name": sale.title,
        "startDate": `${sale.date}T${parseTimeTo24h(sale.start_time)}-05:00`,
        "endDate": `${sale.date}T${parseTimeTo24h(sale.end_time)}-05:00`,
        "eventStatus": eventStatus,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": [primaryImage],
        "location": {
          "@type": "Place",
          "name": sale.general_location || `${sale.city}, ${sale.state}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": sale.city || "Brooklyn",
            "addressRegion": sale.state || "NY",
            "addressCountry": "US"
          }
        },
        "organizer": organizerName
          ? { "@type": "Person", "name": organizerName }
          : { "@type": "Organization", "name": "Stooplify", "url": "https://stooplify.com" },
        "performer": {
          "@type": "Organization",
          "name": "Local Yard Sale Hosts"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "validFrom": sale.created_date ? new Date(sale.created_date).toISOString() : new Date().toISOString(),
          "url": `https://stooplify.com/YardSaleDetails?id=${saleSlug}`
        },
        ...(sale.description ? { "description": sale.description } : {})
      };
    })
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries(['yardSales']);
    await queryClient.invalidateQueries(['favorites']);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title={`${filteredSales.length} Brooklyn Stoop Sales & Yard Sales Near You | Stooplify`}
        description={`Browse ${filteredSales.length} upcoming Brooklyn stoop sales, yard sales, garage sales, and estate sales in your area. Find furniture, clothing, antiques, electronics and more at unbeatable prices.`}
        keywords="brooklyn stoop sale, stoop sales brooklyn, yard sales near me, garage sales today, estate sales, weekend yard sales, local sales, secondhand furniture, thrift shopping, neighborhood sales, NYC stoop sale"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('findYardSales')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('findYardSalesDesc')}
          </p>
        </motion.div>

        {/* Discovery Directory — Desktop: 4-col grid | Mobile: accordion tabs */}
        <MobileDiscovery />

        {/* Desktop only */}
        <div className="hidden md:grid mb-8 grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-[#14B8FF]" />
              <h2 className="font-semibold text-[#2E3A59] dark:text-white text-sm">Browse by City</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CITY_PAGES.map(c => (
                <Link key={c.url} to={c.url} className="text-xs px-2.5 py-1 bg-[#14B8FF]/10 text-[#14B8FF] rounded-full hover:bg-[#14B8FF] hover:text-white transition-colors font-medium">
                  {c.emoji} {c.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#FF6F61]" />
              <h2 className="font-semibold text-[#2E3A59] dark:text-white text-sm">Browse by Neighborhood</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {NEIGHBORHOOD_PAGES.map(n => (
                <Link key={n.url} to={n.url} className="text-xs px-2.5 py-1 bg-[#FF6F61]/10 text-[#FF6F61] rounded-full hover:bg-[#FF6F61] hover:text-white transition-colors font-medium">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#F5A623]" />
              <h2 className="font-semibold text-[#2E3A59] dark:text-white text-sm">Browse by Date</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {DATE_PAGES.map(d => (
                <Link key={d.url} to={d.url} className="text-xs px-2.5 py-1 bg-[#F5A623]/10 text-[#F5A623] rounded-full hover:bg-[#F5A623] hover:text-white transition-colors font-medium">
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-purple-500" />
              <h2 className="font-semibold text-[#2E3A59] dark:text-white text-sm">Browse by Category</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_PAGES.map(cat => (
                <Link key={cat.url} to={cat.url} className="text-xs px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-500 hover:text-white transition-colors font-medium">
                  {cat.emoji} {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <SaleFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            onReset={resetFilters}
          />
        </div>

        {/* View Toggle & Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-[#2E3A59] dark:text-white">
                {viewMode === 'map' && visibleMapSales.length > 0 ? visibleMapSales.length : filteredSales.length}
              </span> {t('salesFound')}
              {viewMode === 'map' && visibleMapSales.length > 0 && visibleMapSales.length < filteredSales.length && (
                <span className="text-xs text-gray-400 ml-1">(in view)</span>
              )}
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showEndedSales}
                onChange={(e) => setShowEndedSales(e.target.checked)}
                className="w-4 h-4 text-[#FF6F61] border-gray-300 rounded focus:ring-[#FF6F61]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Show ended sales</span>
            </label>
          </div>
          
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-[#FF6F61] text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">{t('listView')}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                viewMode === 'map' 
                  ? 'bg-[#FF6F61] text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">{t('mapView')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Error Loading Sales
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Please try refreshing the page</p>
            <Button onClick={() => refetch()} className="bg-[#FF6F61] hover:bg-[#e55a4d]">
              Retry
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {filteredSales.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Map className="w-10 h-10 text-[#FF6F61]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {t('noSalesFound')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('tryAdjustingFilters')}</p>
                    <Button onClick={resetFilters} className="bg-[#FF6F61] hover:bg-[#e55a4d]">
                      {t('resetFilters')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSales.map((sale, index) => (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <SaleCard
                          sale={sale}
                          isFavorite={favorites.includes(sale.id)}
                          onToggleFavorite={handleToggleFavorite}
                          isPast={sale.isPast}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-20 md:mb-0"
              >
                <div className="h-[600px] rounded-2xl overflow-hidden">
                  <SaleMap sales={filteredSales} onVisibleSalesChange={setVisibleMapSales} />
                </div>
                {visibleMapSales.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                      {visibleMapSales.length} sale{visibleMapSales.length !== 1 ? 's' : ''} in current map view
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {visibleMapSales.map((sale, index) => (
                        <motion.div
                          key={sale.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SaleCard
                            sale={sale}
                            isFavorite={favorites.includes(sale.id)}
                            onToggleFavorite={handleToggleFavorite}
                            seller={sale.seller}
                            isPast={sale.isPast}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
    </PullToRefresh>
  );
}