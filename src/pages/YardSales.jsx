import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SaleCard from '../components/sales/SaleCard';
import SaleFilters from '../components/sales/SaleFilters';
import SaleMap from '../components/sales/SaleMap';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isWithinInterval } from 'date-fns';

export default function YardSales() {
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({ category: 'all', date: 'all', distance: 'all', search: '' });
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  
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

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['yardSales'],
    queryFn: async () => {
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 100);
      
      // Fetch sellers for each sale
      const salesWithSellers = await Promise.all(
        allSales.map(async (sale) => {
          if (sale.created_by) {
            const sellers = await base44.entities.User.filter({ email: sale.created_by });
            return { ...sale, seller: sellers[0] || null };
          }
          return { ...sale, seller: null };
        })
      );
      
      return salesWithSellers;
    },
  });

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
    favoriteMutation.mutate(saleId);
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    // Search
    if (filters.search && !sale.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Category
    if (filters.category !== 'all' && sale.category !== filters.category) {
      return false;
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
    
    return true;
  });

  const resetFilters = () => {
    setFilters({ category: 'all', date: 'all', distance: 'all', search: '' });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
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
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-[#2E3A59] dark:text-white">{filteredSales.length}</span> {t('salesFound')}
          </p>
          
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
                            seller={sale.seller}
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
                className="h-[600px] rounded-2xl overflow-hidden"
              >
                <SaleMap sales={filteredSales} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}