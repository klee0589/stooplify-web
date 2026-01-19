import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://kojdxlijskwakkjkdtam.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_c5QCq6-iXelaBtg-8WZ-bw_t655ZwzR'
);

export default function SupabaseSync({ onUpdate }) {
  const [isConnected, setIsConnected] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const hasSyncedRef = useRef(false);

  // One-time sync on mount
  useEffect(() => {
    const initialSync = async () => {
      if (hasSyncedRef.current) return;
      hasSyncedRef.current = true;
      
      try {
        console.log('🔄 Initial sync from Supabase...');
        await base44.functions.invoke('supabasePullUpdates', {});
        console.log('✅ Initial sync complete');
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('❌ Initial sync error:', error);
      }
    };

    initialSync();
  }, []);

  useEffect(() => {
    console.log('🔌 Setting up Supabase realtime subscription...');

    // Subscribe to realtime changes
    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        async (payload) => {
          console.log('📡 Realtime update received:', payload);
          
          const event = payload.eventType;
          const listing = payload.new || payload.old;

          // Sync after realtime event
          try {
            await base44.functions.invoke('supabasePullUpdates', {});
          } catch (error) {
            console.error('❌ Sync error:', error);
          }

          // Show toast notification
          if (event === 'INSERT') {
            toast.success(`🆕 New sale: ${listing.title}`, {
              description: 'Check the map for updates',
            });
            setRecentUpdates(prev => [...prev.slice(-4), { type: 'new', title: listing.title, time: new Date() }]);
          } else if (event === 'UPDATE') {
            toast.info(`📝 Sale updated: ${listing.title}`);
            setRecentUpdates(prev => [...prev.slice(-4), { type: 'update', title: listing.title, time: new Date() }]);
          } else if (event === 'DELETE') {
            toast.error(`🗑️ Sale removed: ${listing.title || 'Unknown'}`);
            setRecentUpdates(prev => [...prev.slice(-4), { type: 'delete', title: listing.title, time: new Date() }]);
          }

          // Trigger refresh in parent component
          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('🔌 Cleaning up Supabase subscription');
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Connecting...</span>
          </>
        )}
      </motion.div>

      {/* Recent Updates */}
      <AnimatePresence>
        {recentUpdates.slice(-1).map((update, idx) => (
          <motion.div
            key={update.time.getTime()}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="mt-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {update.type === 'new' ? '🆕' : update.type === 'update' ? '📝' : '🗑️'} {update.title}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}