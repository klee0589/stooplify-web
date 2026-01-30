import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { MessageCircle, Loader2, ArrowLeft, Inbox } from 'lucide-react';
import { useTranslation } from '../components/translations';
import SellerMessageView from '../components/messaging/SellerMessageView';

export default function Messages() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [selectedSale, setSelectedSale] = useState(null);

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

  const { data: mySales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['myYardSales', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.YardSale.filter({ created_by: user.email }, '-date');
    },
    enabled: !!user,
  });

  const { data: allMessages = [] } = useQuery({
    queryKey: ['allMessages', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const messages = await base44.entities.Message.list();
      // Get messages TO or FROM the user
      return messages.filter(m => m.recipient_email === user.email || m.sender_email === user.email);
    },
    enabled: !!user,
  });

  // Get sales with messages (either seller's sales OR sales the user has messaged about)
  const myMessagedSaleIds = [...new Set(allMessages.map(m => m.yard_sale_id))];
  
  const { data: allRelevantSales = [] } = useQuery({
    queryKey: ['messagedSales', myMessagedSaleIds],
    queryFn: async () => {
      if (myMessagedSaleIds.length === 0) return [];
      // Fetch all sales that have messages
      const sales = await Promise.all(
        myMessagedSaleIds.map(async (saleId) => {
          try {
            const sales = await base44.entities.YardSale.filter({ id: saleId });
            return sales[0];
          } catch {
            return null;
          }
        })
      );
      return sales.filter(s => s !== null);
    },
    enabled: myMessagedSaleIds.length > 0,
  });

  const salesWithMessages = allRelevantSales.map(sale => {
    const saleMessages = allMessages.filter(m => m.yard_sale_id === sale.id);
    const isSeller = sale.created_by === user.email;
    
    if (isSeller) {
      // For seller: count unique buyers
      const uniqueBuyers = [...new Set(saleMessages.map(m => 
        m.sender_email === user.email ? m.recipient_email : m.sender_email
      ))].filter(email => email !== user.email);
      const messageCount = uniqueBuyers.length;
      const unreadCount = [...new Set(saleMessages.filter(m => !m.read && m.sender_email !== user.email).map(m => m.sender_email))].length;
      return { ...sale, messageCount, unreadCount, isSeller: true };
    } else {
      // For buyer: single conversation with seller
      const unreadCount = saleMessages.filter(m => !m.read && m.recipient_email === user.email).length;
      return { ...sale, messageCount: saleMessages.length, unreadCount, isSeller: false };
    }
  });

  if (!user || salesLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6F61] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Profile')}>
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6F61] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Profile
            </motion.button>
          </Link>
          <h1 
            className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-2"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {salesWithMessages.length} {salesWithMessages.length === 1 ? 'sale' : 'sales'} with messages
          </p>
        </div>

        {/* Messages List */}
        {salesWithMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Inbox className="w-10 h-10 text-[#FF6F61]" />
            </div>
            <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              No Messages Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              When buyers message you about your sales, they'll appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {salesWithMessages.map((sale) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setSelectedSale(selectedSale === sale.id ? null : sale.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {sale.photos?.[0] ? (
                      <img 
                        src={sale.photos[0]} 
                        alt={sale.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-[#FF6F61]" />
                      </div>
                    )}
                    <div className="text-left">
                      <h3 className="font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {sale.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sale.messageCount} message{sale.messageCount !== 1 ? 's' : ''}
                        {sale.unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF6F61] text-white">
                            {sale.unreadCount} new
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <MessageCircle className={`w-5 h-5 transition-transform ${selectedSale === sale.id ? 'rotate-180' : ''}`} />
                </button>

                {selectedSale === sale.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700 p-5"
                  >
                    {sale.isSeller ? (
                      <SellerMessageView sale={sale} sellerEmail={user.email} />
                    ) : (
                      <SellerMessageView sale={sale} sellerEmail={sale.created_by} />
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}