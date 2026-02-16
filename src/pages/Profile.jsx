import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  User, Mail, MapPin, Calendar, Heart, Tag, 
  Loader2, ArrowLeft, LogOut, Edit2, Check, X, Clock, Pencil,
  Crown, Zap, CreditCard, Star, Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from 'date-fns';
import AlertSettings from '../components/profile/AlertSettings';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
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
    base44.analytics.track({ eventName: 'profile_page_viewed' });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setEditedName(currentUser.full_name || '');
          setEditedPhone(currentUser.phone || '');
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  const { data: mySales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['mySales', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.YardSale.filter({ created_by: user.email });
    },
    enabled: !!user,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['myFavorites', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.Favorite.filter({ user_email: user.email });
    },
    enabled: !!user,
  });

  const { data: subscription } = useQuery({
    queryKey: ['emailSubscription', user?.email],
    queryFn: async () => {
      if (!user) return null;
      const subs = await base44.entities.EmailSubscriber.filter({ email: user.email });
      return subs.length > 0 ? subs[0] : null;
    },
    enabled: !!user,
  });

  const { data: myReviews = [] } = useQuery({
    queryKey: ['myReviews', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const saleIds = mySales.map(s => s.id);
      const allReviews = await base44.entities.YardSaleReview.list();
      return allReviews.filter(r => saleIds.includes(r.yard_sale_id));
    },
    enabled: !!user && mySales.length > 0,
  });

  const averageRating = myReviews.length > 0 
    ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
    : null;
  
  const isRepeatSeller = mySales.length >= 3;

  const toggleNotificationSetting = useMutation({
    mutationFn: async (data) => {
      await base44.auth.updateMe(data);
      return await base44.auth.me();
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success(t('notificationSettingsUpdated'));
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({ 
        full_name: editedName,
        phone: editedPhone 
      });
      return await base44.auth.me();
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setIsEditing(false);
      toast.success(t('nameUpdatedSuccessfully'));
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
            <User className="w-10 h-10 text-[#FF6F61]" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('signInToViewProfile')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('accessYourProfile')}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('signIn')}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const pendingSales = mySales.filter(s => s.status === 'pending').length;
  const approvedSales = mySales.filter(s => s.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </motion.button>
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {(user.full_name || user.email)?.[0]?.toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3 w-full">
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">Name</Label>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="rounded-xl"
                      placeholder={t('yourName')}
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-1 block">Phone (for SMS)</Label>
                    <Input
                      type="tel"
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="rounded-xl"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user.full_name || '');
                        setEditedPhone(user.phone || '');
                      }}
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => updateNameMutation.mutate()}
                      className="flex-1 bg-green-500 hover:bg-green-600 rounded-xl"
                      disabled={updateNameMutation.isPending}
                    >
                      {updateNameMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 
                    className="text-2xl font-bold text-[#2E3A59] dark:text-white"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {user.full_name || t('setYourName')}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-[#FF6F61] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {user.created_date && (
                  <p className="text-sm text-gray-500">
                    {t('memberSince')} {format(new Date(user.created_date), 'MMMM yyyy')}
                  </p>
                )}
                {isRepeatSeller && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#F5A623]/20 rounded-full">
                    <Award className="w-3 h-3 text-[#F5A623]" />
                    <span className="text-xs font-semibold text-[#F5A623]">{t('repeatSeller')}</span>
                  </div>
                )}
              </div>
              {averageRating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                    <span className="font-semibold text-[#2E3A59]">{averageRating}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({myReviews.length} review{myReviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-2 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              {t('signOut')}
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Tag className="w-5 h-5 text-[#FF6F61]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {mySales.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('mySales')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#F5A623]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-[#F5A623]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {favorites.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('favorites')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#2E3A59]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-[#2E3A59]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {approvedSales}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('activeSales')}</p>
          </div>
        </motion.div>

        {/* Subscription Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-2xl p-6 shadow-lg mb-6 text-white"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {user.subscription_active ? (
                  <Crown className="w-5 h-5" />
                ) : (
                  <Zap className="w-5 h-5" />
                )}
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {user.subscription_active ? t('unlimitedPlan') : t('freePlan')}
                </h3>
              </div>
              <p className="text-white/90 text-sm">
                {user.subscription_active 
                   ? t('postUnlimitedYardSales') 
                   : `${user.free_listings_used || 0} ${t('of')} 1 ${t('freeListingUsed')}`}
              </p>
            </div>
            {user.subscription_active ? (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                {t('active')}
              </div>
            ) : null}
          </div>

          {!user.subscription_active && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{t('upgradeToUnlimited')}</span>
              <span className="text-xl font-bold">$9<span className="text-sm font-normal">/mo</span></span>
            </div>
            <ul className="space-y-1 text-sm text-white/90 mb-3">
              <li>• {t('postUnlimitedYardSales')}</li>
              <li>• {t('noPerListingFees')}</li>
              <li>• {t('prioritySupport')}</li>
            </ul>
            <Link to={createPageUrl('AddYardSale')}>
              <Button className="w-full bg-white text-[#FF6F61] hover:bg-white/90 rounded-xl font-semibold">
                {t('upgradeNow')}
              </Button>
            </Link>
            </div>
          )}

          {!user.subscription_active && (user.free_listings_used || 0) >= 1 && (
            <p className="text-white/80 text-xs text-center">
              {t('orPayPerListing')}
            </p>
          )}
        </motion.div>

        {/* Smart Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <AlertSettings userEmail={user.email} />
        </motion.div>

        {/* Notifications Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6"
        >
          <h3 
            className="text-lg font-bold text-[#2E3A59] dark:text-white mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('notifications')}
          </h3>
          
          <div className="space-y-4">
            {/* Master Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-semibold text-[#2E3A59] dark:text-white">Enable Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Master switch for all notifications</p>
              </div>
              <Switch
                checked={user.notification_enabled ?? true}
                onCheckedChange={(checked) => toggleNotificationSetting.mutate({ notification_enabled: checked })}
              />
            </div>

            {user.notification_enabled !== false && (
              <>
                {/* Notification Methods */}
                <div className="space-y-3">
                  <p className="font-medium text-[#2E3A59] dark:text-white text-sm">Notification Methods</p>
                  
                  <div className="flex items-center justify-between py-2 pl-4">
                    <div>
                      <p className="font-medium text-[#2E3A59] dark:text-white">Email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={user.notification_email ?? true}
                      onCheckedChange={(checked) => toggleNotificationSetting.mutate({ notification_email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 pl-4">
                    <div>
                      <p className="font-medium text-[#2E3A59] dark:text-white">SMS</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.phone ? 'Receive notifications via text' : 'Add phone number to enable'}
                      </p>
                    </div>
                    <Switch
                      checked={user.notification_sms ?? false}
                      onCheckedChange={(checked) => {
                        if (!user.phone) {
                          toast.error('Please add a phone number first');
                          return;
                        }
                        toggleNotificationSetting.mutate({ notification_sms: checked });
                      }}
                      disabled={!user.phone}
                    />
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="font-medium text-[#2E3A59] dark:text-white text-sm">What to Notify About</p>
                  
                  <div className="flex items-center justify-between py-2 pl-4">
                    <div>
                      <p className="font-medium text-[#2E3A59] dark:text-white">New sales</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">New yard sales in your area</p>
                    </div>
                    <Switch
                      checked={user.notify_new_sales ?? true}
                      onCheckedChange={(checked) => toggleNotificationSetting.mutate({ notify_new_sales: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 pl-4">
                    <div>
                      <p className="font-medium text-[#2E3A59] dark:text-white">Favorites</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Updates to your favorited sales</p>
                    </div>
                    <Switch
                      checked={user.notify_favorites ?? true}
                      onCheckedChange={(checked) => toggleNotificationSetting.mutate({ notify_favorites: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2 pl-4">
                    <div>
                      <p className="font-medium text-[#2E3A59] dark:text-white">Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reminders before sales you're attending</p>
                    </div>
                    <Switch
                      checked={user.notify_reminders ?? true}
                      onCheckedChange={(checked) => toggleNotificationSetting.mutate({ notify_reminders: checked })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* My Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-lg font-bold text-[#2E3A59] dark:text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {t('myYardSales')}
            </h3>
            <Link to={createPageUrl('AddYardSale')}>
              <Button className="bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl">
                {t('addNewSale')}
              </Button>
            </Link>
          </div>

          {salesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#FF6F61] animate-spin" />
            </div>
          ) : mySales.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">{t('noYardSalesYet')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Live Sales */}
              {(() => {
                const now = new Date();
                const liveSales = mySales.filter(sale => {
                  if (!sale.date) return false;
                  const saleStartTime = new Date(`${sale.date}T${sale.start_time || '00:00'}`);
                  const saleEndTime = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
                  return now >= saleStartTime && now < saleEndTime;
                });
                
                return liveSales.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#2E3A59] dark:text-white mb-3 flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Current (Live Now)
                    </h4>
                    <div className="space-y-2">
                      {liveSales.map((sale) => (
                        <motion.div
                          key={sale.id}
                          className="bg-green-50 dark:bg-green-900/20 rounded-xl overflow-hidden border-2 border-green-500"
                        >
                          <div className="flex items-center justify-between p-4 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`} className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-3">
                                {sale.photos && sale.photos.length > 0 ? (
                                  <img 
                                    src={sale.photos[0]} 
                                    alt="" 
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-[#2E3A59] dark:text-white">{sale.title}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {sale.start_time || '8:00 AM'} - {sale.end_time || '2:00 PM'}
                                  </p>
                                </div>
                              </div>
                            </Link>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                LIVE NOW
                              </span>
                              <Link to={createPageUrl('AddYardSale') + `?edit=${sale.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* All Sales */}
              <div>
                {mySales.filter(sale => {
                  const now = new Date();
                  if (!sale.date) return true;
                  const saleStartTime = new Date(`${sale.date}T${sale.start_time || '00:00'}`);
                  const saleEndTime = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
                  return !(now >= saleStartTime && now < saleEndTime);
                }).length > 0 && (
                  <>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">All Sales</h4>
                    <div className="space-y-2">
                      {mySales.filter(sale => {
                        const now = new Date();
                        if (!sale.date) return true;
                        const saleStartTime = new Date(`${sale.date}T${sale.start_time || '00:00'}`);
                        const saleEndTime = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
                        return !(now >= saleStartTime && now < saleEndTime);
                      }).map((sale) => {
                        const getSaleStatus = () => {
                          if (!sale.date) return { label: t('dateTBD'), color: 'gray' };

                          const now = new Date();
                          const saleDateTime = new Date(`${sale.date}T${sale.end_time || '23:59'}`);
                          const saleStartTime = new Date(`${sale.date}T${sale.start_time || '00:00'}`);

                          if (now < saleStartTime) {
                            return { label: t('upcoming'), color: 'blue' };
                          } else {
                            return { label: t('finished'), color: 'gray' };
                          }
                        };
                        
                        const saleStatus = getSaleStatus();
                
                return (
                  <motion.div
                    key={sale.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Link to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`} className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-3">
                          {sale.photos && sale.photos.length > 0 ? (
                            <img 
                              src={sale.photos[0]} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-[#FF6F61]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#2E3A59] dark:text-white">{sale.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {sale.date ? format(new Date(sale.date), 'MMM d, yyyy') : 'Date TBD'}
                            </p>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          saleStatus.color === 'blue'
                            ? 'bg-blue-100 text-blue-700'
                            : saleStatus.color === 'green'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {saleStatus.label}
                        </span>
                        <Link to={createPageUrl('AddYardSale') + `?edit=${sale.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}