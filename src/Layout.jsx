import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MapPin, PlusCircle, User, Heart, Settings, Globe, Moon, Sun, LogOut, ChevronDown, MessageCircle, Instagram, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTranslation } from '../components/translations';
import { useTheme, ThemeProvider } from '../components/ThemeProvider';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BottomNavBar from '../components/BottomNavBar';

function LayoutContent({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('en');
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const avatarMenuRef = React.useRef(null);
  const navigate = useNavigate();

  // Root screens that don't show back button
  const rootScreens = ['Home', 'YardSales', 'Messages', 'Profile'];
  const isRootScreen = rootScreens.includes(currentPageName);
  const showBackButton = !isRootScreen;

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

    // Load language preference
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    document.documentElement.lang = savedLang;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
    };

    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarMenuOpen]);

  const t = useTranslation(language);

  // Fetch user's yard sales count
  const { data: userSales = [] } = useQuery({
    queryKey: ['userYardSales', user?.email],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.YardSale.filter({ created_by: user.email });
    },
    enabled: !!user
  });

  // Fetch unread messages count (unique senders)
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadMessages', user?.email],
    queryFn: async () => {
      if (!user) return 0;
      const messages = await base44.entities.Message.filter({ recipient_email: user.email, read: false });
      // Count unique senders with unread messages
      const uniqueSenders = [...new Set(messages.map((m) => m.sender_email))];
      return uniqueSenders.length;
    },
    enabled: !!user,
    refetchInterval: 5000 // Refetch every 5 seconds as backup
  });

  // Real-time subscription for unread messages count
  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = base44.entities.Message.subscribe((event) => {
      // Update unread count only when user RECEIVES a message (not sends)
      if (event.data?.recipient_email === user.email) {
        queryClient.invalidateQueries({ queryKey: ['unreadMessages', user.email] });
        queryClient.refetchQueries({ queryKey: ['unreadMessages', user.email] });
      }
    });

    return unsubscribe;
  }, [user?.email, queryClient]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    localStorage.setItem('stooplify_lang', newLang);
    document.documentElement.lang = newLang;
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
  };

  const navLinks = [
  { name: t('browseSales'), page: 'YardSales', icon: MapPin },
  { name: t('listSale'), page: 'AddYardSale', icon: PlusCircle },
  ...(userSales.length > 0 ? [{ name: t('myYardSales'), page: 'MyYardSales', icon: MapPin }] : []),
  { name: 'Calendar', page: 'Calendar', icon: Settings },
  { name: 'Guides', page: 'Guides', icon: Settings }];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

        :root {
          --primary: #14B8FF;
          --secondary: #1a2842;
          --accent: #F5A623;
          --bg-light: #FAFAFA;
          --text-dark: #1a1a1a;
        }

        .dark {
          --primary: #14B8FF;
          --secondary: #0f1623;
          --accent: #F5A623;
          --bg-light: #0a0e1a;
          --text-dark: #ffffff;
        }

        body {
          font-family: 'Inter', sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
          overscroll-behavior: none;
        }
        
        button, a, [role="button"] {
          user-select: none;
          -webkit-touch-callout: none;
        }

        .dark body {
          background: #050810;
          color: #ffffff;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: #0da3e6;
        }

        .btn-secondary {
          background: var(--secondary);
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
        }

        .text-primary { color: var(--primary); }
        .text-secondary { color: var(--secondary); }
        .text-accent { color: var(--accent); }
        .bg-primary { background: var(--primary); }
        .bg-secondary { background: var(--secondary); }
        .bg-accent { background: var(--accent); }
        .bg-light { background: var(--bg-light); }

        /* Optimize image loading */
        img {
          content-visibility: auto;
        }
      `}</style>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`
        }
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile: Back Button or Logo */}
            {showBackButton ? (
              <button
                onClick={() => navigate(-1)}
                className="flex md:hidden items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#14B8FF] transition-colors"
                style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{t('back')}</span>
              </button>
            ) : (
              <Link to={createPageUrl('Home')} className="flex md:hidden items-center">
                <motion.img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
                  alt="Stooplify"
                  className="h-8 w-auto"
                  whileHover={{ scale: 1.05 }} />
              </Link>
            )}

            {/* Desktop: Logo (always visible) */}
            <Link to={createPageUrl('Home')} className="hidden md:flex items-center">
              <motion.img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
                alt="Stooplify"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`font-medium transition-colors hover:text-[#14B8FF] ${
                currentPageName === link.page ? 'text-[#14B8FF]' : 'text-[#2E3A59] dark:text-white'}`
                }>

                  {link.name}
                </Link>
              )}
            </nav>

            {/* Language Toggle & User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="px-3 py-2 text-[#2E3A59] dark:text-white font-medium hover:text-[#14B8FF] transition-colors flex items-center gap-2"
                title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}>

                <Globe className="w-4 h-4" />
                {language === 'en' ? 'ES' : 'EN'}
              </motion.button>
              
              {user ?
              <div className="relative" ref={avatarMenuRef}>
                  <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">

                    <div className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden">
                      {user.profile_picture ? (
                        <img 
                          src={user.profile_picture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF6F61] to-[#F5A623] flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {(user.full_name || user.email)?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {user && unreadCount > 0 &&
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    }
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${isAvatarMenuOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isAvatarMenuOpen &&
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">

                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-[#2E3A59] dark:text-white truncate">
                            {user.full_name || user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                        
                        <Link
                      to={createPageUrl('Profile')}
                      onClick={() => setIsAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">

                          <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm text-[#2E3A59] dark:text-white">{t('profile')}</span>
                        </Link>
                        
                        <Link
                      to={createPageUrl('Favorites')}
                      onClick={() => setIsAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">

                          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm text-[#2E3A59] dark:text-white">{t('favorites')}</span>
                        </Link>

                        <Link
                      to={createPageUrl('Messages')}
                      onClick={() => setIsAvatarMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">

                          <MessageCircle className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          <span className="text-sm text-[#2E3A59] dark:text-white">Messages</span>
                          {user && unreadCount > 0 &&
                      <span className="ml-auto px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                              {unreadCount}
                            </span>
                      }
                        </Link>
                        
                        <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">

                          {theme === 'light' ? <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                          <span className="text-sm text-[#2E3A59] dark:text-white">
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                          </span>
                        </button>

                        {user?.email === 'klee0589@gmail.com' &&
                    <>
                            





















                          </>
                    }

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                        
                        <button
                      onClick={() => base44.auth.logout()}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400">

                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">{t('signOut')}</span>
                        </button>
                      </motion.div>
                  }
                  </AnimatePresence>
                </div> :

              <>
                  <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => base44.auth.redirectToLogin()}
                  className="px-4 py-2 text-[#2E3A59] dark:text-white font-medium hover:text-[#14B8FF] transition-colors">

                    {t('signIn')}
                  </motion.button>
                  <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(20, 184, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => base44.auth.redirectToLogin()}
                  className="px-6 py-2.5 bg-[#14B8FF] text-white rounded-full font-medium shadow-lg">

                    {t('getStarted')}
                  </motion.button>
                </>
              }
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#2E3A59]">

              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t shadow-lg">

              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) =>
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentPageName === link.page ?
                'bg-[#14B8FF]/10 text-[#14B8FF]' :
                'text-[#2E3A59] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`
                }>

                    <link.icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
              )}

                {user &&
              <>
                    <Link
                  to={createPageUrl('Profile')}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  currentPageName === 'Profile' ?
                  'bg-[#14B8FF]/10 text-[#14B8FF]' :
                  'text-[#2E3A59] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`
                  }>

                      <User size={20} />
                      <span className="font-medium">{t('profile')}</span>
                    </Link>
                    <Link
                  to={createPageUrl('Favorites')}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  currentPageName === 'Favorites' ?
                  'bg-[#14B8FF]/10 text-[#14B8FF]' :
                  'text-[#2E3A59] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`
                  }>

                      <Heart size={20} />
                      <span className="font-medium">{t('favorites')}</span>
                    </Link>
                  </>
              }

                <div className="pt-4 border-t space-y-2">
                  <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#2E3A59] dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">

                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                  <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#2E3A59] dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">

                    <Globe size={20} />
                    <span>{language === 'en' ? 'Español' : 'English'}</span>
                  </button>
                  {user ?
                <button
                  onClick={() => {
                    base44.auth.logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">

                      <LogOut size={20} />
                      <span>{t('signOut')}</span>
                    </button> :

                <button
                  onClick={() => {
                    base44.auth.redirectToLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-[#14B8FF] text-white text-center rounded-xl font-medium">

                      {t('signIn')} / {t('getStarted')}
                    </button>
                }
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main 
        className="pt-16 md:pt-20 pb-0 md:pb-0" 
        style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
        id="main-content"
      >
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavBar />

      {/* Footer */}
      <footer className="bg-[#2E3A59] dark:bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
                alt="Stooplify"
                className="h-10 w-auto brightness-0 invert mb-4" />

              <p className="text-white/70 max-w-sm">
                Discover amazing finds at yard sales near you. Join our community of treasure hunters today!
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{t('quickLinks')}</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to={createPageUrl('YardSales')} className="hover:text-[#14B8FF] transition-colors">{t('findSales')}</Link></li>
                <li><Link to={createPageUrl('AddYardSale')} className="hover:text-[#14B8FF] transition-colors">{t('listYourSale')}</Link></li>
                <li><Link to={createPageUrl('Home')} className="hover:text-[#14B8FF] transition-colors">{t('howItWorks')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{t('legal')}</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-[#14B8FF] transition-colors">{t('privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-[#14B8FF] transition-colors">{t('termsOfService')}</a></li>
                <li><a href="mailto:daniel@stooplify.com" className="hover:text-[#14B8FF] transition-colors">Contact</a></li>
              </ul>
              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Follow Us</h4>
                <a
                  href="https://www.instagram.com/stooplify/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-[#14B8FF] transition-colors">

                  <Instagram className="w-5 h-5" />
                  <span>@stooplify</span>
                </a>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          

































          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>© {new Date().getFullYear()} Stooplify. {t('allRightsReserved')}.</p>
          </div>
          </div>
          </footer>
    </div>);

}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
    <LayoutContent children={children} currentPageName={currentPageName} />
    </ThemeProvider>);

}