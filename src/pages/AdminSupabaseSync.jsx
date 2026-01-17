import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSupabaseSync() {
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    checkAuth();
  }, []);

  const handleSync = async () => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      return;
    }

    setSyncing(true);
    setResult(null);

    try {
      const response = await base44.functions.invoke('supabaseSync', {
        action: 'sync_all'
      });

      console.log('Sync response:', response);
      
      if (response.data.success) {
        setResult({
          success: true,
          message: `✅ Successfully synced ${response.data.synced} listings to Supabase`
        });
        toast.success('Sync completed!');
      } else {
        setResult({
          success: false,
          message: response.data.error || 'Sync failed'
        });
        toast.error('Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setResult({
        success: false,
        message: error.message || 'Unknown error occurred'
      });
      toast.error('Sync error: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Supabase Sync
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sync all existing yard sales to Supabase database
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What does this do?</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Pushes all approved yard sales to Supabase</li>
              <li>• Enables real-time sync with Rork mobile app</li>
              <li>• One-time operation for existing data</li>
              <li>• New sales automatically sync via automations</li>
            </ul>
          </div>

          <Button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-[#14B8FF] hover:bg-[#0da3e6] text-white py-6 text-lg"
          >
            {syncing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Sync All Sales to Supabase
              </>
            )}
          </Button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl ${
                result.success
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-semibold mb-1 ${
                    result.success ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                  }`}>
                    {result.success ? 'Success' : 'Error'}
                  </h4>
                  <p className={`text-sm ${
                    result.success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}