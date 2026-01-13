import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MapPin, PlusCircle, User, Heart, Settings, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useTranslation } from '../components/translations';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('en');

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

  const t = useTranslation(language);
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    localStorage.setItem('stooplify_lang', newLang);
    document.documentElement.lang = newLang;
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
  };

  const navLinks = [
    { name: t('home'), page: 'Home', icon: Home },
    { name: t('browseSales'), page: 'YardSales', icon: MapPin },
    { name: t('listSale'), page: 'AddYardSale', icon: PlusCircle },
    { name: t('pricing'), page: 'Pricing', icon: Settings },
  ];

  const userLinks = user ? [
    { name: t('favorites'), page: 'Favorites', icon: Heart },
    { name: t('profile'), page: 'Profile', icon: User }
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Stooplify - Discover Local Yard Sales & Garage Sales Near You</title>
        <meta name="description" content="Find amazing yard sales, garage sales, and estate sales in your neighborhood. Buy and sell secondhand items, furniture, antiques, and more on Stooplify." />
        <meta name="keywords" content="yard sale, garage sale, estate sale, secondhand, thrift, local sales, buy used items, sell items" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://stooplify.com" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Stooplify - Find Local Yard Sales Near You" />
        <meta property="og:description" content="Discover amazing deals at yard sales and garage sales in your neighborhood" />
        <meta property="og:image" content="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png" />
        <meta property="og:url" content="https://stooplify.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Stooplify - Find Local Yard Sales" />
        <meta name="twitter:description" content="Discover amazing deals at yard sales near you" />
        <meta name="twitter:image" content="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png" />
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Stooplify",
            "url": "https://stooplify.com",
            "description": "Find local yard sales, garage sales, and estate sales in your neighborhood",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://stooplify.com/yard-sales?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        {/* Structured Data - LocalBusiness */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Stooplify",
            "description": "Platform for discovering and listing local yard sales and garage sales",
            "url": "https://stooplify.com",
            "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png",
            "founder": {
              "@type": "Person",
              "name": "Daniel",
              "email": "daniel@stooplify.com"
            },
            "areaServed": "United States",
            "serviceType": "Yard Sale Listings"
          })}
        </script>
      </head>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        :root {
          --primary: #14B8FF;
          --secondary: #2E3A59;
          --accent: #F5A623;
          --bg-light: #F9F9F9;
          --text-dark: #333333;
        }
        
        body {
          font-family: 'Inter', sans-serif;
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
      `}</style>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center">
              <motion.img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
                alt="Stooplify"
                className="h-8 md:h-10 w-auto"
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`font-medium transition-colors hover:text-[#14B8FF] ${
                    currentPageName === link.page ? 'text-[#14B8FF]' : 'text-[#2E3A59]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {userLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`font-medium transition-colors hover:text-[#14B8FF] ${
                    currentPageName === link.page ? 'text-[#14B8FF]' : 'text-[#2E3A59]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Language Toggle & Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="px-3 py-2 text-[#2E3A59] font-medium hover:text-[#14B8FF] transition-colors flex items-center gap-2"
                title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'ES' : 'EN'}
              </motion.button>
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => base44.auth.logout()}
                  className="px-4 py-2 text-[#2E3A59] font-medium hover:text-[#14B8FF] transition-colors"
                >
                  {t('signOut')}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => base44.auth.redirectToLogin()}
                    className="px-4 py-2 text-[#2E3A59] font-medium hover:text-[#14B8FF] transition-colors"
                  >
                    {t('signIn')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(20, 184, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => base44.auth.redirectToLogin()}
                    className="px-6 py-2.5 bg-[#14B8FF] text-white rounded-full font-medium shadow-lg"
                  >
                    {t('getStarted')}
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#2E3A59]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {[...navLinks, ...userLinks].map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      currentPageName === link.page
                        ? 'bg-[#14B8FF]/10 text-[#14B8FF]'
                        : 'text-[#2E3A59] hover:bg-gray-100'
                    }`}
                  >
                    <link.icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t space-y-2">
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#2E3A59] font-medium hover:bg-gray-100 rounded-xl"
                  >
                    <Globe size={20} />
                    <span>{language === 'en' ? 'Español' : 'English'}</span>
                  </button>
                  {user ? (
                    <button
                      onClick={() => {
                        base44.auth.logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[#2E3A59] font-medium hover:bg-gray-100 rounded-xl"
                    >
                      {t('signOut')}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        base44.auth.redirectToLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-[#14B8FF] text-white text-center rounded-xl font-medium"
                    >
                      {t('signIn')} / {t('getStarted')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2E3A59] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6963ba60866b343e03d8de8e/f9ad791a3_logo_v1.png"
                alt="Stooplify"
                className="h-10 w-auto brightness-0 invert mb-4"
              />
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
                <li><a href="#" className="hover:text-[#14B8FF] transition-colors">{t('contactUs')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>© {new Date().getFullYear()} Stooplify. {t('allRightsReserved')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}