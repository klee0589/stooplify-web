import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Heart, Loader2, MapPin, ArrowLeft, Map, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import SaleCard from '../components/sales/SaleCard';
import SaleMap from '../components/sales/SaleMap';
import PullToRefresh from '../components/PullToRefresh';

export default function Favorites() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  const queryClient = useQueryClient();
  
  const handleRefresh = async () => {
    await queryClient.refetchQueries({ queryKey: ['userFavorites'] });
    await queryClient.refetchQueries({ queryKey: ['favoriteSales'] });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['userFavorites', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Favorite.filter({ user_email: user.email });
    },
    enabled: !!user,
  });

  const { data: sales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['favoriteSales', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];
      const allSales = await base44.entities.YardSale.filter({ status: 'approved' });
      const favoriteIds = favorites.map(f => f.yard_sale_id);
      return allSales.filter(sale => favoriteIds.includes(sale.id));
    },
    enabled: favorites.length > 0,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (saleId) => {
      const fav = favorites.find(f => f.yard_sale_id === saleId);
      if (fav) {
        await base44.entities.Favorite.delete(fav.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
    },
  });

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[#FF6F61]" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In to See Favorites
          </h2>
          <p className="text-gray-600 mb-6">
            Save your favorite yard sales and never miss a deal.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const isLoading = favoritesLoading || salesLoading;

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('YardSales')}>
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Sales
            </motion.button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#FF6F61] fill-current" />
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold text-[#2E3A59] dark:text-white"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  My Favorites
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {sales.length} saved sale{sales.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {sales.length > 0 && (
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
                  <span className="hidden sm:inline text-sm font-medium">List</span>
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
                  <span className="hidden sm:inline text-sm font-medium">Map</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
          </div>
        ) : sales.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-[#FF6F61]" />
            </div>
            <h3 
              className="text-xl font-semibold text-[#2E3A59] dark:text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse yard sales and tap the heart to save your favorites.
            </p>
            <Link to={createPageUrl('YardSales')}>
              <Button className="bg-[#FF6F61] hover:bg-[#e55a4d]">
                <MapPin className="w-4 h-4 mr-2" />
                Browse Sales
              </Button>
            </Link>
          </motion.div>
        ) : viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sales.map((sale, index) => (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SaleCard
                    sale={sale}
                    isFavorite={true}
                    onToggleFavorite={(id) => removeFavoriteMutation.mutate(id)}
                  />
                </motion.div>
              ))}
            </div>
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
            <SaleMap sales={sales} />
          </motion.div>
        )}
        </div>
      </div>
    </PullToRefresh>
  );
}