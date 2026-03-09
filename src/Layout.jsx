import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MapPin, PlusCircle, User, Heart, Settings, Globe, Moon, Sun, LogOut, ChevronDown, MessageCircle, Instagram, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTranslation } from '../components/translations';
import { useTheme, ThemeProvider } from '../components/ThemeProvider';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import BottomNavBar from '../components/BottomNavBar';
import SentryErrorBoundary, { setUserContext } from '../components/SentryErrorBoundary';
import LaunchPromoBanner from '../components/sales/LaunchPromoBanner';

// Lazy initialize PostHog (only on user interaction or after 5s)
let posthog = null;
const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog) {
    import('posthog-js').then(({ default: ph }) => {
      if (!ph.__loaded) {
        ph.init('phc_O1v6eh3WZWysCmiW5sODyx8YScYNMEligZyMHZGEekb', {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false,
        });
      }
      posthog = ph;
    }).catch(err => {
      console.log('PostHog failed to load:', err);
      posthog = null;
    });
  }
};

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const PUBLIC_PAGES = [
    'Blog', 'BlogPost', 'BlogSlug',
    'Guides', 'GuidesAdvertise', 'GuidesFindSales', 'GuidesPermit', 'GuidesPricing', 'GuidesTimings', 'GuidesSeniors',
    'guides', 'guides-advertise-yard-sale', 'guides-best-time-yard-sale', 'guides-find-yard-sales',
    'guides-permit-requirements-nyc', 'guides-pricing-yard-sale-items', 'guides-seniors-yard-sales',
    'Legal'
  ];
  const [language, setLanguage] = useState('en');
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const avatarMenuRef = React.useRef(null);
  const navigate = useNavigate();

  // Tab state preservation (scroll position and state per tab)
  const [tabStates, setTabStates] = useState({});
  const mainContentRef = React.useRef(null);
  const ROOT_TABS = ['Home', 'YardSales', 'AddYardSale', 'Messages', 'Profile'];
  const isRootTab = ROOT_TABS.includes(currentPageName);

  // Root screens that don't show back button
  const rootScreens = ['Home', 'YardSales', 'Messages', 'Profile'];
  const isRootScreen = rootScreens.includes(currentPageName);
  const showBackButton = !isRootScreen;

  // Save scroll position when leaving a tab
  useEffect(() => {
    if (isRootTab && mainContentRef.current) {
      setTabStates((prev) => ({
        ...prev,
        [currentPageName]: {
          scrollY: window.scrollY,
          state: prev[currentPageName]?.state || {}
        }
      }));
    }
  }, [location.pathname, isRootTab, currentPageName]);

  // Restore scroll position when returning to a tab
  useEffect(() => {
    if (isRootTab && tabStates[currentPageName]) {
      const savedScrollY = tabStates[currentPageName].scrollY || 0;
      window.scrollTo(0, savedScrollY);
    }
  }, [currentPageName, isRootTab, tabStates]);

  useEffect(() => {
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://base44files.s3.us-east-1.amazonaws.com/stooplify/Stooplify-07-favicon.png';
    document.head.appendChild(link);

    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          setUserContext(currentUser);
          // Initialize PostHog when user is authenticated
          initPostHog();
          if (posthog) {
            posthog.identify(currentUser.email, {
              email: currentUser.email,
              name: currentUser.full_name,
              role: currentUser.role,
            });
          }
        } else if (!PUBLIC_PAGES.includes(currentPageName)) {
          base44.auth.redirectToLogin();
          return;
        }
      } catch (e) {
        console.log('Not authenticated');
        if (!PUBLIC_PAGES.includes(currentPageName)) {
          base44.auth.redirectToLogin();
          return;
        }
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Load language preference
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    document.documentElement.lang = savedLang;

    // Lazy load PostHog after 8 seconds to avoid blocking initial paint
    const timer = setTimeout(() => {
      if (!posthog) initPostHog();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (posthog) {
      posthog.capture('$pageview', { page: currentPageName });
    }
  }, [location.pathname]);

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

  // Don't render protected pages until auth is confirmed
  if (!isAuthChecked && !PUBLIC_PAGES.includes(currentPageName)) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900" />;
  }

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

  // Helper function to map old guide page names to SEO-friendly URLs
  const getSeoUrl = (pageName) => {
    const seoMap = {
      'GuidesAdvertise': 'guides-advertise-yard-sale',
      'GuidesFindSales': 'guides-find-yard-sales',
      'GuidesPermit': 'guides-permit-requirements-nyc',
      'GuidesPricing': 'guides-pricing-yard-sale-items',
      'GuidesTimings': 'guides-best-time-yard-sale',
      'GuidesSeniors': 'guides-seniors-yard-sales'
    };
    return seoMap[pageName] || pageName;
  };

  const navLinks = [
  { name: 'Find Sales', page: 'yard-sales', icon: MapPin },
  { name: 'List Sale', page: 'add-yard-sale', icon: PlusCircle },
  ...(userSales.length > 0 ? [{ name: 'My Sales', page: 'my-yard-sales', icon: MapPin }] : []),
  { name: 'Calendar', page: 'Calendar', icon: Settings },
  { name: 'Guides', page: 'guides', icon: Settings },
  { name: 'Blog', page: 'Blog', icon: Settings }];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      {/* Load fonts non-blocking */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        media="print"
        onLoad={(e) => { e.target.media = 'all'; }}
      />
      <style>{`

        :root {
          --primary: #0099cc;
          --secondary: #1a2842;
          --accent: #F5A623;
          --bg-light: #FAFAFA;
          --text-dark: #1a1a1a;
        }

        .dark {
          --primary: #66d9ff;
          --secondary: #0f1623;
          --accent: #F5A623;
          --bg-light: #0a0e1a;
          --text-dark: #ffffff;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          font-family: 'Inter', sans-serif;
          transition: background-color 0.3s ease, color 0.3s ease;
          overscroll-behavior: none;
        }
        
        /* Accessibility */
        :focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        
        /* Skip to main content for screen readers */
        .skip-to-content {
          position: absolute;
          top: -40px;
          left: 0;
          background: var(--primary);
          color: white;
          padding: 8px;
          z-index: 100000;
        }
        
        .skip-to-content:focus {
          top: 0;
        }
        
        button, a, [role="button"] {
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        .dark body {
          background: #050810;
          color: #ffffff;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Poppins', sans-serif;
        }

        .btn-primary {
          background: #0099cc;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: #007aa3;
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

      {/* Launch Promo Banner */}
      <LaunchPromoBanner />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`
        }
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        role="banner"
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
                  src={theme === 'dark' 
                    ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/3e64c6f8d_Stooplify1-02.png"
                    : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png"
                  }
                  alt="Stooplify"
                  className="h-8 w-auto"
                  width={160}
                  height={64}
                  whileHover={{ scale: 1.05 }} />
              </Link>
            )}

            {/* Desktop: Logo (always visible) */}
            <Link to={createPageUrl('Home')} className="hidden md:flex items-center">
              <motion.img
                src={theme === 'dark' 
                  ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/3e64c6f8d_Stooplify1-02.png"
                  : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png"
                }
                alt="Stooplify"
                className="h-10 w-auto"
                width={200}
                height={80}
                whileHover={{ scale: 1.05 }} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => {
                const seoUrl = getSeoUrl(link.page);
                return (
                  <Link
                    key={link.page}
                    to={createPageUrl(seoUrl)}
                    className={`font-medium transition-colors hover:text-[#14B8FF] ${
                    currentPageName === link.page ? 'text-[#14B8FF]' : 'text-[#2E3A59] dark:text-white'}`
                    }>
                      {link.name}
                    </Link>
                );
              })}
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
                {navLinks.map((link) => {
                  const seoUrl = getSeoUrl(link.page);
                  return (
                    <Link
                      key={link.page}
                      to={createPageUrl(seoUrl)}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      currentPageName === link.page ?
                      'bg-[#14B8FF]/10 text-[#14B8FF]' :
                      'text-[#2E3A59] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`
                      }>
                        <link.icon size={20} />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                  );
                })}

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

      {/* Main Content with Page Transitions */}
      <main 
        ref={mainContentRef}
        className="pt-16 md:pt-20 pb-0 md:pb-0" 
        style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
        id="main-content"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavBar />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src={theme === 'dark' 
                  ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/3e64c6f8d_Stooplify1-02.png"
                  : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png"
                }
                alt="Stooplify"
                className="h-10 w-auto mb-4"
                width={200}
                height={80} />

              <p className="text-gray-600 dark:text-white/70 max-w-sm">
                Discover amazing finds at yard sales near you. Join our community of treasure hunters today!
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{t('quickLinks')}</h4>
              <ul className="space-y-2 text-gray-600 dark:text-white/70">
                <li><Link to={createPageUrl('YardSales')} className="hover:text-[#14B8FF] transition-colors">{t('findSales')}</Link></li>
                <li><Link to={createPageUrl('AddYardSale')} className="hover:text-[#14B8FF] transition-colors">{t('listYourSale')}</Link></li>
                <li><Link to={createPageUrl('Home')} className="hover:text-[#14B8FF] transition-colors">{t('howItWorks')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{t('legal')}</h4>
              <ul className="space-y-2 text-gray-600 dark:text-white/70">
                <li><Link to={createPageUrl('Legal') + '#terms'} className="hover:text-[#14B8FF] transition-colors">{t('termsOfService')}</Link></li>
                <li><Link to={createPageUrl('Legal') + '#privacy'} className="hover:text-[#14B8FF] transition-colors">{t('privacyPolicy')}</Link></li>
                <li><Link to={createPageUrl('Legal') + '#disclaimer'} className="hover:text-[#14B8FF] transition-colors">Disclaimer</Link></li>
                <li><Link to={createPageUrl('Legal') + '#safety'} className="hover:text-[#14B8FF] transition-colors">Safety</Link></li>
                <li><a href="mailto:daniel@stooplify.com" className="hover:text-[#14B8FF] transition-colors">Contact</a></li>
              </ul>
              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Follow Us</h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://www.instagram.com/stooplify/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-[#14B8FF] transition-colors">

                    <Instagram className="w-5 h-5" />
                    <span>@stooplify</span>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61586102653727"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-[#14B8FF] transition-colors">

                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Stooplify</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Email Signup */}
          

































          <div className="border-t border-gray-200 dark:border-white/20 mt-8 pt-8 text-center text-gray-600 dark:text-white/60">
            <p>© {new Date().getFullYear()} Stooplify. {t('allRightsReserved')}.</p>
          </div>
          </div>
          </footer>
    </div>);

}

export default function Layout({ children, currentPageName }) {
  return (
    <SentryErrorBoundary>
      <ThemeProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}