import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Heart, UserCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import SEO from '../components/SEO';
import { useTranslation } from '../components/translations';

export default function Calendar() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [eventFilter, setEventFilter] = useState('all'); // 'all', 'favorites', 'attending'
  
  const t = useTranslation(language);

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
        } else {
          base44.auth.redirectToLogin();
        }
      } catch (e) {
        base44.auth.redirectToLogin();
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
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ['attendances', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Attendance.filter({ user_email: user.email });
    },
    enabled: !!user,
  });

  const { data: allSales = [] } = useQuery({
    queryKey: ['calendarSales', favorites, attendances],
    queryFn: async () => {
      const saleIds = [
        ...favorites.map(f => f.yard_sale_id),
        ...attendances.map(a => a.yard_sale_id)
      ];
      const uniqueSaleIds = [...new Set(saleIds)];
      
      if (uniqueSaleIds.length === 0) return [];
      
      const sales = await base44.entities.YardSale.list();
      const now = new Date();
      
      // Filter to only include upcoming sales (not past)
      return sales.filter(sale => {
        if (!uniqueSaleIds.includes(sale.id)) return false;
        if (!sale.date || !sale.end_time) return true;
        const saleDateTime = new Date(`${sale.date}T${sale.end_time}`);
        return saleDateTime >= now;
      });
    },
    enabled: favorites.length > 0 || attendances.length > 0,
  });

  // Get sales for selected date with filter
  const salesForSelectedDate = allSales.filter(sale => {
    if (!sale.date) return false;
    try {
      const dateMatch = isSameDay(parseISO(sale.date + 'T12:00:00'), selectedDate);
      if (!dateMatch) return false;
      
      // Apply event filter
      if (eventFilter === 'favorites') return isFavorited(sale.id);
      if (eventFilter === 'attending') return isAttending(sale.id);
      return true; // 'all'
    } catch (e) {
      return false;
    }
  });

  // Get dates with events (respecting filter)
  const datesWithEvents = allSales
    .filter(sale => {
      if (!sale.date) return false;
      // Apply event filter
      if (eventFilter === 'favorites') return isFavorited(sale.id);
      if (eventFilter === 'attending') return isAttending(sale.id);
      return true; // 'all'
    })
    .map(sale => {
      try {
        return parseISO(sale.date + 'T12:00:00');
      } catch (e) {
        return null;
      }
    })
    .filter(date => date !== null);

  const isFavorited = (saleId) => favorites.some(f => f.yard_sale_id === saleId);
  const isAttending = (saleId) => attendances.some(a => a.yard_sale_id === saleId);
  
  // Count only upcoming attendances
  const upcomingAttendancesCount = allSales.filter(sale => isAttending(sale.id)).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <CalendarIcon className="w-12 h-12 text-[#14B8FF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title="My Calendar | Stooplify"
        description="View all your favorited and attending yard sales in one place"
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
            My Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View all your favorited and attending yard sales
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
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
            </div>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              modifiers={{
                hasEvent: datesWithEvents
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: 'bold',
                  background: '#14B8FF',
                  color: 'white',
                  borderRadius: '50%'
                }
              }}
              className="rounded-xl border-0"
            />
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-3 h-3 rounded-full bg-[#14B8FF]"></div>
              <span>Days with events</span>
            </div>
          </motion.div>

          {/* Sales for Selected Date */}
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
        </div>

        {/* All Upcoming Events */}
        {allSales.length > 0 && (
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
              All My Events ({allSales.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSales
                .filter(sale => sale.date)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
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
                      {sale.date ? format(parseISO(sale.date + 'T12:00:00'), 'MMM d, yyyy') : 'Date TBD'}
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