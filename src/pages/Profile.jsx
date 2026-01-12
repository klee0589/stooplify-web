import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  User, Mail, MapPin, Calendar, Heart, Tag, 
  Loader2, ArrowLeft, LogOut, Edit2, Check, X, Clock 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from 'date-fns';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setEditedName(currentUser.full_name || '');
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

  const toggleNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (subscription) {
        await base44.entities.EmailSubscriber.update(subscription.id, { 
          notify_new_sales: !subscription.notify_new_sales 
        });
      } else {
        await base44.entities.EmailSubscriber.create({
          email: user.email,
          notify_new_sales: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailSubscription'] });
      toast.success('Notification settings updated');
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: async () => {
      await base44.auth.updateMe({ full_name: editedName });
    },
    onSuccess: () => {
      setUser(prev => ({ ...prev, full_name: editedName }));
      setIsEditing(false);
      toast.success('Name updated successfully');
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
            Sign In to View Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Access your profile and manage your yard sales.
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

  const pendingSales = mySales.filter(s => s.status === 'pending').length;
  const approvedSales = mySales.filter(s => s.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6F61] to-[#F5A623] rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">
                {(user.full_name || user.email)?.[0]?.toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="max-w-[250px] rounded-xl"
                    placeholder="Your name"
                  />
                  <Button
                    size="icon"
                    onClick={() => updateNameMutation.mutate()}
                    className="bg-green-500 hover:bg-green-600 rounded-xl"
                    disabled={updateNameMutation.isPending}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(user.full_name || '');
                    }}
                    className="rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 
                    className="text-2xl font-bold text-[#2E3A59]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {user.full_name || 'Set your name'}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-[#FF6F61] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              {user.created_date && (
                <p className="text-sm text-gray-500 mt-2">
                  Member since {format(new Date(user.created_date), 'MMMM yyyy')}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => base44.auth.logout()}
              className="flex items-center gap-2 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
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
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Tag className="w-5 h-5 text-[#FF6F61]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {mySales.length}
            </p>
            <p className="text-sm text-gray-500">My Sales</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#F5A623]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-[#F5A623]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {favorites.length}
            </p>
            <p className="text-sm text-gray-500">Favorites</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-[#2E3A59]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-[#2E3A59]" />
            </div>
            <p className="text-2xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {approvedSales}
            </p>
            <p className="text-sm text-gray-500">Active Sales</p>
          </div>
        </motion.div>

        {/* Notifications Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <h3 
            className="text-lg font-bold text-[#2E3A59] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#2E3A59]">Email notifications</p>
              <p className="text-sm text-gray-500">Get notified about new yard sales in your area</p>
            </div>
            <Switch
              checked={subscription?.notify_new_sales || false}
              onCheckedChange={() => toggleNotificationsMutation.mutate()}
            />
          </div>
        </motion.div>

        {/* My Sales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-lg font-bold text-[#2E3A59]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              My Yard Sales
            </h3>
            <Link to={createPageUrl('AddYardSale')}>
              <Button className="bg-[#FF6F61] hover:bg-[#e55a4d] rounded-xl">
                Add New Sale
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
              <p className="text-gray-500">You haven't listed any yard sales yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mySales.map((sale) => {
                const getSaleStatus = () => {
                  if (!sale.date) return { label: 'Date TBD', color: 'gray' };
                  
                  const saleDate = new Date(sale.date);
                  const now = new Date();
                  
                  // Set time for comparison
                  const saleDateStart = new Date(saleDate);
                  saleDateStart.setHours(0, 0, 0, 0);
                  const saleDateEnd = new Date(saleDate);
                  saleDateEnd.setHours(23, 59, 59, 999);
                  
                  const nowTime = now.getTime();
                  
                  if (nowTime < saleDateStart.getTime()) {
                    return { label: 'Upcoming', color: 'blue' };
                  } else if (nowTime >= saleDateStart.getTime() && nowTime <= saleDateEnd.getTime()) {
                    return { label: 'In Progress', color: 'green' };
                  } else {
                    return { label: 'Finished', color: 'gray' };
                  }
                };
                
                const saleStatus = getSaleStatus();
                
                return (
                  <Link key={sale.id} to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
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
                          <p className="font-medium text-[#2E3A59]">{sale.title}</p>
                          <p className="text-sm text-gray-500">
                            {sale.date ? format(new Date(sale.date), 'MMM d, yyyy') : 'Date TBD'}
                          </p>
                        </div>
                      </div>
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sale.status === 'approved' 
                            ? 'bg-green-100 text-green-700'
                            : sale.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {sale.status}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}