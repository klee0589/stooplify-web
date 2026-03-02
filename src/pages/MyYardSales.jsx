import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Calendar, MapPin, Edit, Trash2, Eye, Loader2, Plus, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';
import { toast } from "sonner";
import { useTranslation } from '../components/translations';
import SEO from '../components/SEO';

export default function MyYardSales() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showFinishedSales, setShowFinishedSales] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const t = useTranslation(language);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  useEffect(() => {
    // Check if redirected here due to listing limit
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgrade') === 'true') {
      setShowUpgradeBanner(true);
    }
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

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ['myYardSales', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const allSales = await base44.entities.YardSale.filter({ created_by: user.email }, '-date');
      return allSales;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (saleId) => {
      await base44.entities.YardSale.delete(saleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myYardSales'] });
      toast.success('Sale deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete sale');
    },
  });

  const handleDelete = (sale) => {
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
    
    if (window.confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      deleteMutation.mutate(sale.id);
    }
  };

  const canDeleteSale = (sale) => {
    if (!sale?.date || !sale?.start_time) return true;
    const saleDateTime = new Date(`${sale.date}T${sale.start_time}`);
    const now = new Date();
    const hoursUntilSale = (saleDateTime - now) / (1000 * 60 * 60);
    return hoursUntilSale >= 2;
  };

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return null;
    }
  };

  const getSaleStatus = (sale) => {
    if (!sale.date) return 'upcoming';
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    
    const saleDate = parseLocalDate(sale.date);
    if (!saleDate) return 'upcoming';
    
    // Compare just the date, not time
    if (saleDate < now) return 'finished';
    if (saleDate.getTime() === now.getTime()) return 'inProgress';
    return 'upcoming';
  };

  const upcomingSales = sales.filter(sale => getSaleStatus(sale) === 'upcoming');
  const inProgressSales = sales.filter(sale => getSaleStatus(sale) === 'inProgress');
  const finishedSales = sales.filter(sale => getSaleStatus(sale) === 'finished');

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 py-8">
      <SEO 
        title={`My Yard Sales (${sales.length}) - Manage Your Listings | Stooplify`}
        description={`View and manage your ${sales.length} yard sale listing${sales.length !== 1 ? 's' : ''}. Edit details, track views, and update your sales in real-time.`}
        keywords="my yard sales, manage listings, edit yard sale, my garage sales, seller dashboard"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upgrade Banner */}
        {showUpgradeBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-4"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Free Listing Already Used
              </h3>
              <p className="text-amber-700 text-sm mb-3">
                You've already used your 1 free listing. To post more yard sales, you'll need to upgrade to a paid plan.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link to={createPageUrl('AddYardSale')}>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
                    <CreditCard className="w-4 h-4" />
                    View Plans ($4 single / $9/mo unlimited)
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-amber-700" onClick={() => setShowUpgradeBanner(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('myYardSales')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {sales.length} {sales.length === 1 ? t('sale') : t('sales')} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
              <Switch
                checked={showFinishedSales}
                onCheckedChange={setShowFinishedSales}
              />
              <span>Show finished</span>
            </label>
            <Link to={createPageUrl('AddYardSale')}>
              <Button className="bg-[#FF6F61] hover:bg-[#e55a4d] gap-2">
                <Plus className="w-4 h-4" />
                {t('addNewSale')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Sales Sections */}
        {sales.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-[#FF6F61]" />
            </div>
            <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {t('noYardSalesYet')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by creating your first yard sale listing
            </p>
            <Link to={createPageUrl('AddYardSale')}>
              <Button className="bg-[#FF6F61] hover:bg-[#e55a4d]">
                {t('listYourSale')}
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* In Progress */}
            {inProgressSales.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('inProgress')} ({inProgressSales.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressSales.map((sale) => (
                    <SaleCard
                      key={sale.id}
                      sale={sale}
                      onDelete={handleDelete}
                      canDelete={canDeleteSale(sale)}
                      status="inProgress"
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingSales.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('upcoming')} ({upcomingSales.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingSales.map((sale) => (
                    <SaleCard
                      key={sale.id}
                      sale={sale}
                      onDelete={handleDelete}
                      canDelete={canDeleteSale(sale)}
                      status="upcoming"
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Finished */}
            {showFinishedSales && finishedSales.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {t('finished')} ({finishedSales.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {finishedSales.map((sale) => (
                    <SaleCard
                      key={sale.id}
                      sale={sale}
                      onDelete={handleDelete}
                      canDelete={canDeleteSale(sale)}
                      status="finished"
                      t={t}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SaleCard({ sale, onDelete, canDelete, status, t }) {
  const statusColors = {
    upcoming: 'bg-blue-500',
    inProgress: 'bg-green-500',
    finished: 'bg-gray-400',
  };

  const statusLabels = {
    upcoming: t('upcoming'),
    inProgress: t('inProgress'),
    finished: t('finished'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="aspect-[16/9] bg-gradient-to-br from-[#FF6F61]/10 to-[#F5A623]/10 relative">
        {sale.photos?.[0] ? (
          <img src={sale.photos[0]} alt={sale.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-[#FF6F61]/30" />
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 ${statusColors[status]} text-white text-xs font-semibold rounded-full`}>
          {statusLabels[status]}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-[#2E3A59] dark:text-white mb-2 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {sale.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{sale.date ? format(new Date(sale.date), 'MMM d, yyyy') : t('dateTBD')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{sale.city}, {sale.state}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {sale.views || 0} views
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
          <Link to={createPageUrl('AddYardSale') + `?edit=${sale.id}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            className="gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            size="sm"
            onClick={() => onDelete(sale)}
            disabled={!canDelete}
            title={!canDelete ? 'Cannot delete within 2 hours of start time' : ''}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}