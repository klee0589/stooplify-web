import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Menu, X, Home, MapPin, PlusCircle, MessageCircle, User, Heart, BookOpen, Newspaper } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { useTheme } from './ThemeProvider';

const PAGE_TITLES = {
  Home: 'Stooplify',
  YardSales: 'Find Sales',
  'yard-sales': 'Find Sales',
  AddYardSale: 'Post a Sale',
  'add-yard-sale': 'Post a Sale',
  Messages: 'Messages',
  Profile: 'Profile',
  Favorites: 'Favorites',
  Blog: 'Blog',
  guides: 'Guides',
  Pricing: 'Pricing',
  Calendar: 'Calendar',
};

const ROOT_PAGES = ['Home', 'YardSales', 'yard-sales', 'Messages', 'Profile'];

const menuItems = [
  { label: 'Home', path: 'Home', icon: Home },
  { label: 'Browse Sales', path: 'yard-sales', icon: MapPin },
  { label: 'Post a Sale', path: 'add-yard-sale', icon: PlusCircle },
  { label: 'Messages', path: 'Messages', icon: MessageCircle },
  { label: 'Profile', path: 'Profile', icon: User },
  { label: 'Favorites', path: 'Favorites', icon: Heart },
  { label: 'Guides', path: 'guides', icon: BookOpen },
  { label: 'Blog', path: 'Blog', icon: Newspaper },
];

export default function MobileWebHeader({ currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isRoot = ROOT_PAGES.includes(currentPageName);
  const title = PAGE_TITLES[currentPageName] || 'Stooplify';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1002] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: back or logo */}
          {isRoot || currentPageName === 'Home' ? (
            <img
              src={theme === 'dark'
                ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/3e64c6f8d_Stooplify1-02.png"
                : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png"
              }
              alt="Stooplify"
              className="h-7 w-auto"
            />
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-300 min-w-[44px] min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          {/* Center: page title (non-home pages) */}
          {!isRoot && (
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-800 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {title}
            </span>
          )}

          {/* Right: hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* Full-screen slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-[2000] bg-white dark:bg-gray-900 flex flex-col"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100 dark:border-gray-800">
              <img
                src={theme === 'dark'
                  ? "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/3e64c6f8d_Stooplify1-02.png"
                  : "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/283ee8687_logo_v2.png"
                }
                alt="Stooplify"
                className="h-7 w-auto"
              />
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#14B8FF]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#14B8FF]" />
                    </div>
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer actions */}
            <div className="px-4 pb-8 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <button
                onClick={() => { base44.auth.redirectToLogin(); setMenuOpen(false); }}
                className="w-full py-3 bg-[#14B8FF] text-white rounded-2xl font-semibold text-sm"
              >
                Sign In / Get Started
              </button>
              <button
                onClick={() => base44.auth.logout()}
                className="w-full py-3 text-gray-500 dark:text-gray-400 text-sm"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}