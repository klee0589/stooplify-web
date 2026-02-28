import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Heart, UserCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createPageUrl } from '../utils';
import SEO from '../components/SEO';
import { useTranslation } from '../components/translations';

// Haversine distance in miles
function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Component to watch map bounds
function MapBoundsWatcher({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
  });
  React.useEffect(() => {
    onBoundsChange(map.getBounds());
  }, []);
  return null;
}

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [eventFilter, setEventFilter] = useState('all'); // 'all', 'favorites', 'attending'
  const [showFinished, setShowFinished] = useState(false);
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 }); // Default NYC
  
  const t = useTranslation(language);

  // Helper function to parse YYYY-MM-DD dates consistently in local timezone
  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return null;
    }
  };

  // Try to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // keep default on error
      );
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
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
        // User not authenticated, that's okay - set user to null
      }
    };
    checkAuth();
  }, []);

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Favorite.filter({ user_email: user.email });
    },
    enabled: !!user,
    initialData: [],
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Attendance.filter({ user_email: user.email });
    },
    enabled: !!user,
    initialData: [],
  });

  const { data: allSales = [] } = useQuery({
    queryKey: ['calendarSales', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const sales = await base44.entities.YardSale.filter({ status: 'approved' });
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today
      // Only upcoming/live sales
      return sales.filter(sale => {
        if (!sale.date) return false;
        const saleDate = parseLocalDate(sale.date);
        return saleDate && saleDate >= now;
      });
    },
    enabled: !!user,
  });

  // Get user's own created sales
  const { data: myYardSales = [] } = useQuery({
    queryKey: ['myCreatedSales', user?.email, showFinished],
    queryFn: async () => {
      if (!user) return [];
      const sales = await base44.entities.YardSale.filter({ created_by: user.email });
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      return sales.filter(sale => {
        if (!sale.date) return false;
        const saleDate = parseLocalDate(sale.date);
        if (!saleDate) return false;
        
        // If showFinished is false, only show upcoming/current sales
        if (!showFinished) {
          return saleDate >= now;
        }
        // If showFinished is true, show all sales
        return true;
      }).sort((a, b) => {
        const dateA = parseLocalDate(a.date);
        const dateB = parseLocalDate(b.date);
        return dateA - dateB;
      });
    },
    enabled: !!user,
  });

  // Helper functions
  const isFavorited = (saleId) => favorites.some(f => f.yard_sale_id === saleId);
  const isAttending = (saleId) => attendances.some(a => a.yard_sale_id === saleId);

  // Filter sales by map bounds; always include sales the user is attending
  const isInMapBounds = useCallback((sale) => {
    if (attendances.some(a => a.yard_sale_id === sale.id)) return true;
    if (!sale.latitude || !sale.longitude) return false;
    if (mapBounds) {
      return mapBounds.contains([sale.latitude, sale.longitude]);
    }
    return getDistanceMiles(userLocation.lat, userLocation.lng, sale.latitude, sale.longitude) <= 25;
  }, [mapBounds, userLocation, attendances]);

  // Sales visible in map area
  const visibleSales = allSales.filter(isInMapBounds);

  // Get sales for selected date with filter (location-filtered)
  const salesForSelectedDate = visibleSales.filter(sale => {
    if (!sale.date) return false;
    const saleDate = parseLocalDate(sale.date);
    if (!saleDate) return false;
    
    const dateMatch = isSameDay(saleDate, selectedDate);
    if (!dateMatch) return false;
    
    // Apply event filter
    if (eventFilter === 'favorites') return isFavorited(sale.id);
    if (eventFilter === 'attending') return isAttending(sale.id);
    return true; // 'all'
  });

  // Get dates with events (respecting filter + location)
  const datesWithEvents = visibleSales
    .filter(sale => {
      if (!sale.date) return false;
      // Apply event filter
      if (eventFilter === 'favorites') return isFavorited(sale.id);
      if (eventFilter === 'attending') return isAttending(sale.id);
      return true; // 'all'
    })
    .map(sale => parseLocalDate(sale.date))
    .filter(date => date !== null);
  
  // Count only upcoming attendances
  const upcomingAttendancesCount = allSales.filter(sale => isAttending(sale.id)).length;



  const upcomingSalesCount = allSales.length;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "My Yard Sale Calendar",
    "description": "Your personalized calendar of saved and attending yard sales",
    "numberOfItems": upcomingSalesCount
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title="My Yard Sale Calendar - Track Favorites & Attending Sales | Stooplify"
        description={`Manage your ${favorites.length} favorite yard sales and ${upcomingAttendancesCount} sales you're attending. Never miss a local sale with your personalized calendar view.`}
        keywords="yard sale calendar, my saved sales, attending events, favorite sales, sale reminders, upcoming yard sales"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Yard Sale Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse upcoming yard sales by date
          </p>
        </motion.div>

        {/* Stats */}
        {user && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#FF6F61]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2E3A59] dark:text-white">
                      {favorites.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Favorites</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2E3A59] dark:text-white">
                      {upcomingAttendancesCount}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Attending</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setShowFinished(!showFinished)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showFinished
                    ? 'bg-[#14B8FF] text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#14B8FF]'
                }`}
              >
                {showFinished ? 'Hide Finished Sales' : 'Show Finished Sales'}
              </button>
            </div>
          </>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-xl font-bold text-[#2E3A59] dark:text-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Calendar View
              </h2>
              {user && (
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setEventFilter('all')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      eventFilter === 'all'
                        ? 'bg-white dark:bg-gray-600 text-[#2E3A59] dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#2E3A59] dark:hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setEventFilter('favorites')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      eventFilter === 'favorites'
                        ? 'bg-white dark:bg-gray-600 text-[#FF6F61] shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#FF6F61]'
                    }`}
                  >
                    <Heart className="w-3 h-3" />
                    Favorites
                  </button>
                  <button
                    onClick={() => setEventFilter('attending')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                      eventFilter === 'attending'
                        ? 'bg-white dark:bg-gray-600 text-green-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-green-600'
                    }`}
                  >
                    <UserCheck className="w-3 h-3" />
                    Attending
                  </button>
                </div>
              )}
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              modifiers={{
                hasEvent: datesWithEvents
              }}
              modifiersClassNames={{
                hasEvent: 'bg-[#14B8FF] text-white font-bold hover:bg-[#14B8FF] hover:text-white'
              }}
              className="rounded-xl border-0"
            />
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 rounded-full bg-[#14B8FF]"></div>
              <span>Days with events</span>
            </div>
          </motion.div>

          {/* Sales for Selected Date */}
          <div className="flex flex-col gap-4">
            {/* Mini Map for area selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm"
              style={{ height: '200px' }}
            >
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <MapBoundsWatcher onBoundsChange={setMapBounds} />
              </MapContainer>
            </motion.div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center -mt-2">
              Pan/zoom the map to filter events by area
            </p>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h2 
              className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h2>

            {salesForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">No events on this date</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salesForSelectedDate.map((sale) => (
                  <motion.div
                    key={sale.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-[#14B8FF] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[#2E3A59] dark:text-white">
                        {sale.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isFavorited(sale.id) && (
                          <Heart className="w-4 h-4 text-[#FF6F61] fill-current" />
                        )}
                        {isAttending(sale.id) && (
                          <UserCheck className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F5A623]" />
                        <span>{sale.start_time || '8:00 AM'} - {sale.end_time || '2:00 PM'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#14B8FF]" />
                        <span>{sale.general_location || sale.city}</span>
                      </div>
                    </div>

                    <Link 
                      to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#14B8FF] text-white rounded-xl text-sm font-medium hover:bg-[#0da3e6] transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          </div>{/* end flex flex-col */}
        </div>{/* end grid lg:grid-cols-2 */}

        {/* My Yard Sales - Sales created by user */}
        {user && myYardSales.filter(isInMapBounds).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h2 
              className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              My Yard Sales ({myYardSales.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myYardSales.filter(isInMapBounds).map((sale) => (
                <Link
                  key={sale.id}
                  to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#14B8FF] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">
                      {sale.title}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      sale.status === 'approved' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {sale.date ? format(parseLocalDate(sale.date), 'MMM d, yyyy') : 'Date TBD'}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Upcoming Events - Only attending, filtered by map */}
        {user && visibleSales.filter(sale => isAttending(sale.id)).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <h2 
              className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Events I'm Attending ({visibleSales.filter(sale => isAttending(sale.id)).length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSales
                .filter(sale => sale.date && isAttending(sale.id))
                .sort((a, b) => {
                  const dateA = parseLocalDate(a.date);
                  const dateB = parseLocalDate(b.date);
                  return dateA - dateB;
                })
                .map((sale) => (
                  <Link
                    key={sale.id}
                    to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#14B8FF] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">
                        {sale.title}
                      </p>
                      <div className="flex items-center gap-1">
                        {isFavorited(sale.id) && (
                          <Heart className="w-3.5 h-3.5 text-[#FF6F61] fill-current" />
                        )}
                        {isAttending(sale.id) && (
                          <UserCheck className="w-3.5 h-3.5 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {sale.date ? format(parseLocalDate(sale.date), 'MMM d, yyyy') : 'Date TBD'}
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}