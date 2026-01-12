import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MapPin, PlusCircle, User, Heart, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Find Sales', page: 'YardSales', icon: MapPin },
    { name: 'Add Sale', page: 'AddYardSale', icon: PlusCircle },
  ];

  const userLinks = user ? [
    { name: 'Favorites', page: 'Favorites', icon: Heart },
    { name: 'Profile', page: 'Profile', icon: User }
  ] : [];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        :root {
          --primary: #FF6F61;
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
          background: #e55a4d;
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
                  className={`font-medium transition-colors hover:text-[#FF6F61] ${
                    currentPageName === link.page ? 'text-[#FF6F61]' : 'text-[#2E3A59]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {userLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`font-medium transition-colors hover:text-[#FF6F61] ${
                    currentPageName === link.page ? 'text-[#FF6F61]' : 'text-[#2E3A59]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => base44.auth.logout()}
                  className="px-4 py-2 text-[#2E3A59] font-medium hover:text-[#FF6F61] transition-colors"
                >
                  Sign Out
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => base44.auth.redirectToLogin()}
                    className="px-4 py-2 text-[#2E3A59] font-medium hover:text-[#FF6F61] transition-colors"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255, 111, 97, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => base44.auth.redirectToLogin()}
                    className="px-6 py-2.5 bg-[#FF6F61] text-white rounded-full font-medium shadow-lg"
                  >
                    Get Started
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
                        ? 'bg-[#FF6F61]/10 text-[#FF6F61]'
                        : 'text-[#2E3A59] hover:bg-gray-100'
                    }`}
                  >
                    <link.icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {user ? (
                    <button
                      onClick={() => {
                        base44.auth.logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[#2E3A59] font-medium hover:bg-gray-100 rounded-xl"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        base44.auth.redirectToLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 bg-[#FF6F61] text-white text-center rounded-xl font-medium"
                    >
                      Sign In / Get Started
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
              <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to={createPageUrl('YardSales')} className="hover:text-[#FF6F61] transition-colors">Find Sales</Link></li>
                <li><Link to={createPageUrl('AddYardSale')} className="hover:text-[#FF6F61] transition-colors">List Your Sale</Link></li>
                <li><Link to={createPageUrl('Home')} className="hover:text-[#FF6F61] transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Legal</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-[#FF6F61] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF6F61] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#FF6F61] transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>© {new Date().getFullYear()} Stooplify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}