import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Download, Maximize2, Users, RefreshCw, Sun, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function QRCodeDisplay({ saleId, saleTitle, saleAddress }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qrPayload, setQrPayload] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokenExpiresAt, setTokenExpiresAt] = useState(null);
  const [brightMode, setBrightMode] = useState(false);

  // Fetch check-in count
  const { data: scanCount = 0, refetch: refetchScans } = useQuery({
    queryKey: ['scanCount', saleId],
    queryFn: async () => {
      const scans = await base44.entities.VerifiedScan.filter({ yard_sale_id: saleId });
      return scans.length;
    },
    refetchInterval: 15000,
  });

  const generateToken = useCallback(async () => {
    setIsGenerating(true);
    try {
      const { data } = await base44.functions.invoke('generateQRToken', { sale_id: saleId });
      setQrPayload(data.payload);
      const parsed = JSON.parse(data.payload);
      setTokenExpiresAt(parsed.expires_at);
    } catch (e) {
      console.error('Failed to generate QR token:', e);
    } finally {
      setIsGenerating(false);
    }
  }, [saleId]);

  useEffect(() => {
    generateToken();
  }, [generateToken]);

  // Auto-refresh token 5 minutes before expiry
  useEffect(() => {
    if (!tokenExpiresAt) return;
    const refreshIn = tokenExpiresAt - Date.now() - 5 * 60 * 1000;
    if (refreshIn <= 0) return;
    const timer = setTimeout(generateToken, refreshIn);
    return () => clearTimeout(timer);
  }, [tokenExpiresAt, generateToken]);

  const handleDownload = () => {
    const svg = document.getElementById('seller-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 500; canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(img, 0, 0, 500, 500);
      const link = document.createElement('a');
      link.download = `stooplify-checkin-${saleId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const expiresInHours = tokenExpiresAt ? Math.max(0, Math.round((tokenExpiresAt - Date.now()) / (1000 * 60 * 60))) : null;

  return (
    <>
      {/* Compact card */}
      <div className="bg-gradient-to-br from-[#2E3A59] to-[#1a2238] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-[#14B8FF]" />
            </div>
            <div>
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Check-In QR Code</h3>
              <p className="text-white/60 text-xs">Only you can see this</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Users className="w-4 h-4 text-[#14B8FF]" />
            <span className="font-bold text-lg">{scanCount}</span>
            <span className="text-white/60 text-xs">checked in</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white p-2 rounded-xl flex-shrink-0">
            {qrPayload ? (
              <QRCodeSVG id="seller-qr-svg" value={qrPayload} size={110} level="H" includeMargin={false} />
            ) : (
              <div className="w-[110px] h-[110px] flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            <p className="text-white/80 text-sm leading-relaxed">
              Show this to buyers at your sale. They scan it to check in and earn <span className="text-[#F5A623] font-semibold">credits</span>.
            </p>
            {expiresInHours !== null && (
              <p className="text-white/40 text-xs">Token valid for ~{expiresInHours}h</p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsFullscreen(true)} size="sm" className="bg-[#14B8FF] hover:bg-[#0da3e6] text-white gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                Show Full Screen
              </Button>
              <Button onClick={generateToken} size="sm" variant="outline" disabled={isGenerating}
                className="border-white/30 text-white hover:bg-white/10 gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleDownload} size="sm" variant="outline"
                className="border-white/30 text-white hover:bg-white/10 gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen seller QR display */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 ${brightMode ? 'bg-white' : 'bg-[#0f1623]'}`}
          >
            {/* Top controls */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
              <button
                onClick={() => setBrightMode(!brightMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${brightMode ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white'}`}
              >
                <Sun className="w-4 h-4" />
                {brightMode ? 'Dark' : 'Bright'}
              </button>

              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${brightMode ? 'bg-gray-100' : 'bg-white/10'}`}>
                <Users className={`w-4 h-4 ${brightMode ? 'text-[#14B8FF]' : 'text-[#14B8FF]'}`} />
                <span className={`font-bold ${brightMode ? 'text-gray-800' : 'text-white'}`}>{scanCount}</span>
                <span className={`text-xs ${brightMode ? 'text-gray-500' : 'text-white/60'}`}>checked in</span>
                <button onClick={() => refetchScans()} className="ml-1">
                  <RefreshCw className={`w-3 h-3 ${brightMode ? 'text-gray-400' : 'text-white/40'}`} />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${brightMode ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR code */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className={`text-2xl font-bold mb-1 ${brightMode ? 'text-gray-900' : 'text-white'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {saleTitle}
              </h2>
              {saleAddress && (
                <p className={`text-sm mb-6 ${brightMode ? 'text-gray-500' : 'text-white/50'}`}>{saleAddress}</p>
              )}

              <div className={`p-4 rounded-3xl shadow-2xl mb-6 ${brightMode ? 'bg-white' : 'bg-white'}`}>
                {qrPayload ? (
                  <QRCodeSVG value={qrPayload} size={260} level="H" includeMargin={false} />
                ) : (
                  <div className="w-[260px] h-[260px] flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              <p className={`text-lg font-semibold mb-2 ${brightMode ? 'text-gray-800' : 'text-white'}`}>
                Buyers scan this to check in
              </p>
              <p className={`text-sm max-w-xs leading-relaxed ${brightMode ? 'text-gray-500' : 'text-white/50'}`}>
                Open Stooplify → Tap "Are you at this sale?" → Scan this code
              </p>

              {expiresInHours !== null && (
                <p className={`text-xs mt-4 ${brightMode ? 'text-gray-400' : 'text-white/30'}`}>
                  QR valid for ~{expiresInHours} hour{expiresInHours !== 1 ? 's' : ''}
                </p>
              )}
            </motion.div>

            {/* Bottom actions */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 px-6 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
              <Button onClick={handleDownload} variant="outline"
                className={`gap-2 ${brightMode ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-white/20 text-white hover:bg-white/10'}`}>
                <Download className="w-4 h-4" />
                Save PNG
              </Button>
              <Button onClick={generateToken} disabled={isGenerating} variant="outline"
                className={`gap-2 ${brightMode ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-white/20 text-white hover:bg-white/10'}`}>
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                New Token
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}