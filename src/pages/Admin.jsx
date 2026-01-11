import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  Shield, Tag, Users, Mail, Eye, Check, X, 
  Loader2, ArrowLeft, Download, Calendar, MapPin,
  TrendingUp, Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { toast } from "sonner";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setIsAdmin(currentUser.role === 'admin');
        }
      } catch (e) {
        console.log('Not authenticated');
      }
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  const { data: allSales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['adminSales'],
    queryFn: async () => {
      return await base44.entities.YardSale.list('-created_date', 100);
    },
    enabled: isAdmin,
  });

  const { data: subscribers = [] } = useQuery({
    queryKey: ['adminSubscribers'],
    queryFn: async () => {
      return await base44.entities.EmailSubscriber.list('-created_date', 500);
    },
    enabled: isAdmin,
  });

  const approveMutation = useMutation({
    mutationFn: async (saleId) => {
      await base44.entities.YardSale.update(saleId, { status: 'approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSales'] });
      toast.success('Sale approved!');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (saleId) => {
      await base44.entities.YardSale.update(saleId, { status: 'rejected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSales'] });
      toast.success('Sale rejected');
    },
  });

  const exportEmails = () => {
    const emails = subscribers.map(s => s.email).join('\n');
    const blob = new Blob([emails], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stooplify_subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Email list exported!');
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-[#FF6F61] hover:bg-[#e55a4d]">
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const pendingSales = allSales.filter(s => s.status === 'pending');
  const approvedSales = allSales.filter(s => s.status === 'approved');
  const totalViews = allSales.reduce((sum, s) => sum + (s.views || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Home')}>
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F61] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </motion.button>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2E3A59] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold text-[#2E3A59]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage yard sales and subscribers</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-[#FF6F61]" />
              </div>
              <span className="text-sm text-gray-500">Total Sales</span>
            </div>
            <p className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {allSales.length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#F5A623]/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#F5A623]" />
              </div>
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {pendingSales.length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#2E3A59]/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2E3A59]" />
              </div>
              <span className="text-sm text-gray-500">Subscribers</span>
            </div>
            <p className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {subscribers.length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Views</span>
            </div>
            <p className="text-3xl font-bold text-[#2E3A59]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {totalViews}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-white rounded-xl p-1 shadow-sm mb-6">
              <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-[#FF6F61] data-[state=active]:text-white">
                Pending ({pendingSales.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-[#FF6F61] data-[state=active]:text-white">
                Approved ({approvedSales.length})
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="rounded-lg data-[state=active]:bg-[#FF6F61] data-[state=active]:text-white">
                Subscribers
              </TabsTrigger>
            </TabsList>

            {/* Pending Sales */}
            <TabsContent value="pending">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {salesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
                  </div>
                ) : pendingSales.length === 0 ? (
                  <div className="text-center py-12">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">No pending sales to review!</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {pendingSales.map((sale) => (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {sale.photos && sale.photos.length > 0 ? (
                            <img 
                              src={sale.photos[0]} 
                              alt="" 
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2E3A59] truncate">{sale.title}</h4>
                            <p className="text-sm text-gray-500">
                              {sale.city}, {sale.state} • {sale.date ? format(new Date(sale.date), 'MMM d') : 'No date'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Submitted {sale.created_date ? format(new Date(sale.created_date), 'MMM d, h:mm a') : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => approveMutation.mutate(sale.id)}
                            disabled={approveMutation.isPending}
                            className="bg-green-500 hover:bg-green-600 rounded-xl"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => rejectMutation.mutate(sale.id)}
                            disabled={rejectMutation.isPending}
                            className="rounded-xl text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Approved Sales */}
            <TabsContent value="approved">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {approvedSales.length === 0 ? (
                  <div className="text-center py-12">
                    <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No approved sales yet</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {approvedSales.map((sale) => (
                      <Link 
                        key={sale.id} 
                        to={createPageUrl('YardSaleDetails') + `?id=${sale.id}`}
                      >
                        <motion.div
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          className="p-4 md:p-6 flex items-center gap-4"
                        >
                          {sale.photos && sale.photos.length > 0 ? (
                            <img 
                              src={sale.photos[0]} 
                              alt="" 
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2E3A59] truncate">{sale.title}</h4>
                            <p className="text-sm text-gray-500">
                              {sale.city}, {sale.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#2E3A59]">
                              {sale.views || 0} views
                            </p>
                            <p className="text-xs text-gray-500">
                              {sale.date ? format(new Date(sale.date), 'MMM d') : ''}
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Subscribers */}
            <TabsContent value="subscribers">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {subscribers.length} email subscriber{subscribers.length !== 1 ? 's' : ''}
                  </p>
                  <Button
                    onClick={exportEmails}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                {subscribers.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">No subscribers yet</p>
                  </div>
                ) : (
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {subscribers.map((sub) => (
                      <div key={sub.id} className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF6F61]/10 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#FF6F61]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#2E3A59]">{sub.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {sub.created_date ? format(new Date(sub.created_date), 'MMM d, yyyy') : ''}
                          </p>
                        </div>
                        <Badge variant={sub.notify_new_sales ? 'default' : 'secondary'}>
                          {sub.notify_new_sales ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}