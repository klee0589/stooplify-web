import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ children, onRefresh }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const maxPullDistance = 80;
  const refreshThreshold = 60;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!pulling.current) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;
    
    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, maxPullDistance));
      if (distance < maxPullDistance) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    pulling.current = false;
    
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    
    setPullDistance(0);
  };

  const rotation = (pullDistance / maxPullDistance) * 360;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen"
    >
      {pullDistance > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: pullDistance > 20 ? 1 : 0, 
            y: pullDistance > 20 ? 0 : -50 
          }}
          className="fixed top-0 left-0 right-0 flex justify-center pt-4 z-40"
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
            <RefreshCw 
              className={`w-5 h-5 text-[#14B8FF] ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ 
                transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
                transition: isRefreshing ? 'none' : 'transform 0.1s'
              }}
            />
          </div>
        </motion.div>
      )}
      <motion.div
        animate={{ y: pullDistance > 0 ? pullDistance * 0.5 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </div>
  );
}