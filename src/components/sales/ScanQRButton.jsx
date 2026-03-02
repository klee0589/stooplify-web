import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, XCircle, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ScanQRButton({ saleId, sale, user }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [alreadyScanned, setAlreadyScanned] = useState(false);

  // Check on mount if user already scanned this sale
  useEffect(() => {
    const checkExistingScan = async () => {
      if (!user?.email || !saleId) return;
      try {
        const scans = await base44.entities.VerifiedScan.filter({
          yard_sale_id: saleId,
          scanner_user_email: user.email
        });
        if (scans.length > 0) setAlreadyScanned(true);
      } catch (e) {
        // silently ignore
      }
    };
    checkExistingScan();
  }, [user?.email, saleId]);

  const handleScan = async () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }

    setStatus('loading');

    let latitude = null;
    let longitude = null;

    // Try to get location
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (e) {
      // Location denied — scan will still record but won't be geo-valid
    }

    try {
      const { data } = await base44.functions.invoke('processScan', {
        yard_sale_id: saleId,
        latitude,
        longitude
      });

      setResult(data);
      setStatus(data.success ? 'success' : 'error');

      if (data.success) {
        setAlreadyScanned(true);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Scan failed');
      }
    } catch (err) {
      setStatus('error');
      setResult({ error: err.message });
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (alreadyScanned && status !== 'success') {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">You already scanned this sale ✓</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
        whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
        onClick={handleScan}
        disabled={status === 'loading' || status === 'success'}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold shadow-lg transition-all ${
          status === 'success'
            ? 'bg-green-500 text-white'
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] text-white hover:shadow-[0_10px_30px_rgba(20,184,255,0.4)]'
        }`}
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : status === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : status === 'error' ? (
          <XCircle className="w-5 h-5" />
        ) : (
          <QrCode className="w-5 h-5" />
        )}
        {status === 'loading' ? 'Verifying...'
          : status === 'success' ? `+${result?.credits_awarded || 0} Credits Earned!`
          : status === 'error' ? 'Scan Failed'
          : '📱 Scan to Earn Credits'}
      </motion.button>

      <AnimatePresence>
        {status === 'success' && result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"
          >
            <p className="text-green-800 font-semibold text-lg">🎉 Scan Verified!</p>
            {result.is_geo_valid ? (
              <p className="text-green-600 text-sm mt-1">
                You earned <strong>{result.credits_awarded} Stooplify credits</strong> for attending this sale!
              </p>
            ) : (
              <div className="flex items-center justify-center gap-1 mt-1 text-amber-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Scan recorded. Enable location to earn credits.</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-gray-400">
        💎 Earn 10 credits per verified scan · Max 3/day
      </p>
    </div>
  );
}