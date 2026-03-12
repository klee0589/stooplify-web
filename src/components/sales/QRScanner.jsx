import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, ZapOff } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const [torch, setTorch] = useState(false);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    let scanner;

    const startScanner = async () => {
      try {
        scanner = new Html5Qrcode('qr-reader');
        scannerInstanceRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {} // ignore scan errors (frequent false negatives)
        );
      } catch (err) {
        if (err?.message?.includes('Permission')) {
          setError('camera_denied');
        } else {
          setError('unavailable');
        }
      }
    };

    startScanner();

    return () => {
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const toggleTorch = async () => {
    try {
      const track = scannerInstanceRef.current?.getRunningTrackCapabilities?.();
      if (track?.torch !== undefined) {
        await scannerInstanceRef.current.applyVideoConstraints({ advanced: [{ torch: !torch }] });
        setTorch(!torch);
      }
    } catch {
      // torch not supported on this device
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <p className="text-white font-semibold text-sm">Scan Seller's QR Code</p>
        <button
          onClick={toggleTorch}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white"
        >
          {torch ? <ZapOff className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </button>
      </div>

      {/* Scanner */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {error ? (
          <div className="px-8 text-center text-white space-y-4">
            {error === 'camera_denied' ? (
              <>
                <p className="text-2xl">📷</p>
                <p className="font-semibold text-lg">Camera Access Denied</p>
                <p className="text-white/70 text-sm">
                  Please enable camera permissions in your browser or device settings, then try again.
                </p>
                <p className="text-white/50 text-xs">
                  iOS: Settings → Safari → Camera → Allow<br />
                  Android: Settings → Apps → Browser → Permissions → Camera
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl">⚠️</p>
                <p className="font-semibold text-lg">Camera Unavailable</p>
                <p className="text-white/70 text-sm">Unable to access camera. Please try again.</p>
              </>
            )}
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-full"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Scanner element */}
            <div
              id="qr-reader"
              ref={scannerRef}
              className="w-full h-full"
              style={{ maxHeight: '70vh' }}
            />

            {/* Overlay frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#14B8FF] rounded-tl-md" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#14B8FF] rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#14B8FF] rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#14B8FF] rounded-br-md" />
                {/* Scan line */}
                <motion.div
                  className="absolute left-2 right-2 h-0.5 bg-[#14B8FF]/70"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer hint */}
      {!error && (
        <div className="px-6 pb-8 text-center">
          <p className="text-white/60 text-sm">Point camera at the seller's QR code</p>
        </div>
      )}
    </motion.div>
  );
}