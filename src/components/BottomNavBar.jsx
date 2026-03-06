import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Home, MapPin, PlusCircle, MessageCircle, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function BottomNavBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const scrollPositions = useRef({});

  // Scroll to top on every navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unreadMessages', user?.email],
    queryFn: async () => {
      if (!user) return 0;
      const messages = await base44.entities.Message.filter({ recipient_email: user.email, read: false });
      const uniqueSenders = [...new Set(messages.map((m) => m.sender_email))];
      return uniqueSenders.length;
    },
    enabled: !!user,
    refetchInterval: 30000
  });

  const isActive = (path) => {
    const currentPath = location.pathname.replace('/', '');
    return currentPath === path || (currentPath === '' && path === 'Home');
  };

  const handleNavClick = (e, path) => {
    const active = isActive(path);
    if (active) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Home', path: 'Home', icon: Home },
    { name: 'Browse', path: 'YardSales', icon: MapPin },
    { name: 'Post', path: 'AddYardSale', icon: PlusCircle, highlight: true },
    { name: 'Messages', path: 'Messages', icon: MessageCircle, badge: user && unreadCount > 0 ? unreadCount : null },
    { name: 'Profile', path: 'Profile', icon: User }
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-[1001]"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        userSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={createPageUrl(item.path)}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                item.highlight 
                  ? 'text-[#FF6F61]' 
                  : active 
                  ? 'text-[#14B8FF]' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${item.highlight ? 'w-7 h-7' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${item.highlight ? 'font-semibold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}